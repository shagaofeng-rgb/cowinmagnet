"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";

export default function AdminEditorDrawer({ title, children }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const controls = [...document.querySelectorAll(".admin-editor-panel button, .admin-editor-panel input, .admin-editor-panel select, .admin-editor-panel textarea, .admin-editor-panel a")]
        .filter((element) => !element.disabled && element.getClientRects().length);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="admin-editor-trigger-row">
        <button ref={triggerRef} type="button" className="admin-editor-trigger" onClick={() => setOpen(true)}>
          <Plus size={17} aria-hidden="true" />{title}
        </button>
      </div>
      {open ? (
        <div className="admin-editor-layer">
          <button type="button" className="admin-editor-backdrop" aria-label={`关闭${title}`} onClick={() => setOpen(false)} />
          <section className="admin-editor-panel" role="dialog" aria-modal="true" aria-label={title}>
            <div className="admin-editor-head">
              <div><span>内容管理</span><h2>{title}</h2></div>
              <button ref={closeRef} type="button" aria-label="关闭编辑" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <div className="admin-editor-body">{children}</div>
          </section>
        </div>
      ) : null}
    </>
  );
}
