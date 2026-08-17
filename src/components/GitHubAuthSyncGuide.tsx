/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * SEC Whistleblower Ref #17684-273-411-436 | Magic: 0x3F8F9A1B2C3D | RFC 0103 Full-Duplex Kernel
 * Architecture: GitHub Authentication & Token-Free Sync Guide
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React, { useState } from 'react';
import { 
  Key, 
  Terminal, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  GitBranch, 
  Download, 
  FileCode, 
  HelpCircle,
  AlertCircle,
  Laptop
} from 'lucide-react';

export const GitHubAuthSyncGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sshKeyGenCmd = `ssh-keygen -t ed25519 -C "gmail@albertlane.net" -f ~/.ssh/id_ed25519_albertlane`;
  const sshAddCmd = `eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519_albertlane`;
  const sshPushCmd = `git remote set-url origin git@github.com:Albert-lane/GOOGLE-LLC-IS-ANTI-CONSUMER-v2.git
git push -u origin main`;
  const ghCliAuthCmd = `gh auth login --web -h github.com`;

  return (
    <div id="github-auth-sync-guide" className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono border border-amber-400/30">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Token-Free & SSH Push Methods
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-mono border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Direct GitHub Authentication
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            GitHub Push Authentication Options (No Token Required)
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Because GitHub disabled password authentication for Git operations, here are the 3 native, standard ways to authenticate and push to <code className="text-amber-300 font-mono">Albert-lane/GOOGLE-LLC-IS-ANTI-CONSUMER-v2</code> without dealing with manual tokens.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 text-xs text-zinc-700">
        {/* Method 1: GitHub CLI Browser Login */}
        <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">1</span>
              <span>Method 1: GitHub CLI (`gh`) Web Browser Login (Easiest — Zero Tokens)</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
              RECOMMENDED
            </span>
          </div>
          <p className="text-zinc-600">
            If you have the official GitHub CLI (<code className="font-mono bg-white px-1 py-0.5 rounded border border-zinc-200">gh</code>) installed on your machine, it opens a web browser to log you in automatically via OAuth without generating any token strings:
          </p>
          <div className="flex items-center justify-between p-3 bg-zinc-950 text-zinc-200 rounded-lg font-mono text-[11px]">
            <code>{ghCliAuthCmd}</code>
            <button
              onClick={() => copyToClipboard(ghCliAuthCmd, 1)}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1 transition-colors"
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-zinc-500 text-[11px]">
            Once logged in with <code className="font-mono">gh auth login</code>, running <code className="font-mono">git push</code> will authenticate seamlessly.
          </p>
        </div>

        {/* Method 2: SSH Key Authentication */}
        <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
              <span>Method 2: SSH Deploy / Public Key (Permanent & Token-Free)</span>
            </div>
            <a
              href="https://github.com/settings/ssh/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              <span>GitHub SSH Keys Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-zinc-600">
            SSH keys allow your computer to push code to your GitHub repositories securely using cryptographic keys instead of passwords or tokens.
          </p>
          
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-800">Step A: Generate an SSH key on your computer:</div>
            <div className="flex items-center justify-between p-3 bg-zinc-950 text-zinc-200 rounded-lg font-mono text-[11px]">
              <code>{sshKeyGenCmd}</code>
              <button
                onClick={() => copyToClipboard(sshKeyGenCmd, 2)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1 transition-colors"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-800">Step B: Add the key to your agent and paste your public key (<code className="font-mono">~/.ssh/id_ed25519_albertlane.pub</code>) into <a href="https://github.com/settings/ssh/new" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">GitHub SSH Settings</a>:</div>
            <div className="flex items-center justify-between p-3 bg-zinc-950 text-zinc-200 rounded-lg font-mono text-[11px]">
              <code>{sshAddCmd}</code>
              <button
                onClick={() => copyToClipboard(sshAddCmd, 3)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1 transition-colors"
              >
                {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 3 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-800">Step C: Switch git remote to SSH and push:</div>
            <div className="flex items-center justify-between p-3 bg-zinc-950 text-zinc-200 rounded-lg font-mono text-[11px]">
              <code>{sshPushCmd}</code>
              <button
                onClick={() => copyToClipboard(sshPushCmd, 4)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1 transition-colors"
              >
                {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 4 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Method 3: GitHub Desktop App */}
        <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">3</span>
              <span>Method 3: GitHub Desktop (Graphical Push — Zero CLI)</span>
            </div>
            <a
              href="https://desktop.github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              <span>Download GitHub Desktop</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-zinc-600">
            You can download <strong>GitHub Desktop</strong> on your computer. Sign in with your GitHub account, open this repository folder, and click the <strong>"Push origin"</strong> button. GitHub Desktop manages all authentication in the background automatically.
          </p>
        </div>

        {/* Note on Where Personal Access Tokens are located on GitHub */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Where Personal Access Tokens are located on GitHub (if ever needed):</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            If you ever need a token in the future, GitHub moved it to:
            <br />
            <strong>GitHub.com &rarr; Click your profile icon (top right) &rarr; Settings &rarr; Developer Settings (bottom left) &rarr; Personal access tokens &rarr; Tokens (classic) &rarr; Generate new token</strong>.
            <br />
            Direct link:{' '}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              https://github.com/settings/tokens
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
