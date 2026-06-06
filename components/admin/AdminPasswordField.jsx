"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function AdminPasswordField() {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      登录密码
      <span className="admin-password-field">
        <input
          name="password"
          type={visible ? "text" : "password"}
          placeholder="请输入后台密码"
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          aria-label={visible ? "隐藏密码" : "显示密码"}
          title={visible ? "隐藏密码" : "显示密码"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </span>
    </label>
  );
}
