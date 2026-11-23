// Runs Python (Pyodide) off the main thread so a runaway loop can be stopped.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

const HARNESS = String.raw`
import sys, io, json, traceback, re, contextlib

def _pq_input(prompt=""):
    raise RuntimeError("input() isn't available here. Use a variable instead.")

def _pq_err(e):
    line = None
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == "main.py":
            line = fr.lineno
    msg = f"{type(e).__name__}: {e}"
    return f"Line {line}: {msg}" if line else msg

def _pq_exec(src):
    g = {"__name__": "__main__", "input": _pq_input}
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(src, "main.py", "exec"), g)
    g["_out"] = buf.getvalue()
    return g

def _pq_run(code, tests):
    buf = io.StringIO()
    g = {"__name__": "__main__", "input": _pq_input}
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "main.py", "exec"), g)
    except SyntaxError as e:
        return json.dumps({"ok": False, "out": buf.getvalue(), "error": f"Line {e.lineno}: SyntaxError: {e.msg}"})
    except Exception as e:
        return json.dumps({"ok": False, "out": buf.getvalue(), "error": _pq_err(e)})
    out = buf.getvalue()
    if not tests.strip():
        return json.dumps({"ok": True, "out": out})

    def _rerun(**vals):
        src = code
        for k, v in vals.items():
            src = re.sub(rf"^{k}\s*=.*$", lambda m: f"{k} = {v!r}", src, count=1, flags=re.M)
        return _pq_exec(src)

    def _capture(fn, *args, **kwargs):
        b = io.StringIO()
        with contextlib.redirect_stdout(b):
            fn(*args, **kwargs)
        return b.getvalue()

    g.update({"_out": out, "_src": code, "_rerun": _rerun, "_capture": _capture})
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            exec(compile(tests, "tests.py", "exec"), g)
    except AssertionError as e:
        return json.dumps({"ok": False, "out": out, "fail": str(e) or "Not quite. Read the task again."})
    except NameError as e:
        return json.dumps({"ok": False, "out": out, "fail": f"{str(e).capitalize()}. Did you create it with the exact name?"})
    except Exception as e:
        return json.dumps({"ok": False, "out": out, "fail": _pq_err(e)})
    return json.dumps({"ok": True, "out": out, "passed": True})
`;

const ready = (async () => {
  const pyodide = await loadPyodide();
  pyodide.runPython(HARNESS);
  return pyodide;
})();

ready.then(
  () => postMessage({ type: "ready" }),
  (e) => postMessage({ type: "init-error", error: String(e) })
);

onmessage = async (e) => {
  const { id, code, tests } = e.data;
  try {
    const pyodide = await ready;
    const fn = pyodide.globals.get("_pq_run");
    const raw = fn(code, tests || "");
    fn.destroy();
    postMessage({ type: "result", id, result: JSON.parse(raw) });
  } catch (err) {
    postMessage({ type: "result", id, result: { ok: false, out: "", error: String(err) } });
  }
};
