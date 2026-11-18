import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";

export default function IssuedCredentials({ title = "Login created", credentials, onDone }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard?.writeText(
      `Username: ${credentials.username}\nPassword: ${credentials.password}`,
    );
    setCopied(true);
  };

  return (
    <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
      <p className="flex items-center gap-2 text-sm font-black text-emerald-800">
        <KeyRound size={16} /> {title}
      </p>
      <p className="text-xs font-medium text-emerald-700">
        Share these with the user now. The password is shown only once and cannot be viewed again.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-sm">
        <div className="rounded-xl bg-white px-4 py-2 border border-emerald-100">
          <span className="block text-[10px] font-sans font-black uppercase text-slate-400">Username</span>
          {credentials.username}
        </div>
        <div className="rounded-xl bg-white px-4 py-2 border border-emerald-100">
          <span className="block text-[10px] font-sans font-black uppercase text-slate-400">Password</span>
          {credentials.password}
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={copy} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-emerald-700 border border-emerald-200">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
            Done
          </button>
        )}
      </div>
    </div>
  );
}
