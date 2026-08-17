/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Assertions: SEC Whistleblower #17684-273-411-436
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import React, { useState } from 'react';
import { Lock, Check, Copy, ShieldAlert, FileText, Scale } from 'lucide-react';

export const LicenseViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'declaration' | 'notice'>('declaration');
  const [copied, setCopied] = useState(false);

  const declarationContent = `# ALBERT LANE PROPRIETARY SOFTWARE LICENSE AND INTELLECTUAL PROPERTY DECLARATION

## Complete Reservation of All Rights — No Contractual License Granted Without Explicit Written Agreement

Rights Holder: Albert Lane ("Rights Holder," "Author," "Owner")
Effective Date: May 30, 2026
Governing Jurisdiction (Primary): State of Oregon, United States of America
Governing Jurisdiction (Secondary): England and Wales, United Kingdom
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Contact: albertlane.net

---

PRELIMINARY NOTICE — READ BEFORE PROCEEDING

This document does two different things, and it is important to keep them separate:

Part A — Statutory and common-law IP rights. Copyright, trade secret protection, and unregistered trademark rights in the Covered Works exist automatically, by operation of law, from the moment of creation or first use, in every jurisdiction that recognizes them. These rights do not depend on anyone's agreement, notice, registration, or acceptance. This document declares and documents those rights; it does not create them and does not need anyone's consent to be true. Article II is a statement of fact about ownership, not an offer that requires acceptance.

Part B — Contractual terms. Everything in this document that goes beyond what copyright/trade secret/trademark law already provides — audit rights, compliance reporting, indemnification obligations, telemetry consent, remote-update mechanisms, damages stipulations, "no good faith expectation of stability," and similar terms — is a contract, and contracts require actual mutual assent. Under U.S. and UK law, a party that has not signed, clicked to accept, or otherwise affirmatively manifested agreement is not bound by browse-wrap terms merely by viewing, crawling, or otherwise passively encountering a document. These contractual provisions bind only parties who have executed a written License Agreement with Rights Holder. Where this document uses the word "Accessing Party" in a contractual-obligation clause, that term means a party operating under such a signed agreement, not the general public, unless the clause is expressly limited to describing conduct that independently violates Part A rights (which requires no agreement to be unlawful).

Practical effect: Someone who scrapes, indexes, or trains a model on a Covered Work without permission may still be liable for copyright or trade-secret infringement under ordinary statutory law — that liability doesn't need this document's contract clauses. But they are not, by that act alone, bound by this document's audit rights, reporting obligations, or damages stipulations, because they never agreed to them. This document is drafted to make that boundary explicit rather than to overstate it.

TO CORPORATE LEGAL DEPARTMENTS: Part A of this document constitutes actual notice of asserted IP rights, which is legally meaningful (e.g., for willfulness determinations). Part B constitutes an offer to contract, open to acceptance by executing a License Agreement. No summary or excerpt substitutes for full review before agreeing to a License Agreement.

---

ARTICLE I — DEFINITIONS
1.01 "Covered Works" means, collectively, every item listed in Article III, including all items meeting those definitions whether or not specifically enumerated. See Article III § 3.11 for the identification mechanism used to determine, in any specific dispute, whether a given artifact is a Covered Work.
1.02 "Intellectual Property" means all forms of legally recognizable exclusive rights in creations of the mind, whether currently recognized by law or recognized in the future, including: copyrights, unregistered copyrights, common law copyrights, moral rights, neighboring rights, database rights, sui generis database rights, trade secrets, trademarks, unregistered trademarks, trade dress, service marks, certification marks, collective marks, geographical indications, patents, patent applications, provisional patents, utility models, design rights, registered design rights, unregistered design rights, semiconductor topography rights, plant variety rights, and any other form of intellectual property protection.
1.03 "Unregistered Intellectual Property" means all intellectual property in Covered Works for which no formal registration has been filed or granted with any governmental authority, which nonetheless carries full legal protection under applicable common law, statutory law, international treaty, or equitable doctrine. Absence of registration does not diminish ownership or enforceability.
1.04 "Common Law Rights" means rights arising from authorship, creation, first use, or public disclosure under common law doctrines, including common law copyright (vesting at moment of creation), common law trademark (vesting at first use in commerce), and trade secret protection (vesting upon creation and reasonable steps to maintain secrecy).
1.05 "Accessing Party" means, for purposes of Part A (IP-rights) provisions, any individual, legal entity, automated system, or agent that accesses, views, receives, caches, indexes, processes, trains upon, or interacts with Covered Works in any manner. For purposes of Part B (contractual) provisions, it means a party that has executed a written License Agreement with Rights Holder — see Preliminary Notice.
1.06 "Commercial Entity" means any individual, partnership, corporation, limited liability company, trust, cooperative, joint venture, nonprofit with commercial activities, government contractor, or other organization engaged in or supporting commercial activity of any kind.
1.07 "Derivative Work" means any work based upon, incorporating, referencing, substantially similar to, or functionally equivalent to Covered Works, including translations, implementations, ports, wrappers, adaptations, compilations, and any other form in which the Covered Works may be recast, transformed, or adapted.
1.08 "AI System" means any system employing machine learning, deep learning, neural networks, large language models, foundation models, transformer architectures, diffusion models, reinforcement learning, or any other statistical or computational method for generating, predicting, classifying, recommending, or synthesizing outputs based on patterns derived from training data.
1.09 "Google" means Google LLC, Alphabet Inc., and their subsidiaries and affiliates, used here only as a named example of a Commercial Entity subject to the same rules that apply to every other Commercial Entity under Article IV. No provision of this License imposes different substantive obligations on Google than on any other party; Article V exists to make the application of Article IV concrete, not to create a separate legal standard.
1.10 "Platform Provider" means any entity providing hosting, content delivery, computation, storage, indexing, search, distribution, or networking services used to access, distribute, or process Covered Works.

---

ARTICLE II — OWNERSHIP, COPYRIGHT, AND INTELLECTUAL PROPERTY DECLARATION
2.01 Universal Ownership Declaration: Albert Lane is and shall remain the sole and exclusive owner of all Intellectual Property in and to all Covered Works. This ownership vests automatically upon creation under 17 U.S.C. § 302 and CDPA 1988 § 11.
2.02 Copyright (Registered Works): Full statutory protections including eligibility for statutory damages under 17 U.S.C. § 504 and attorney's fees under 17 U.S.C. § 505 and CDPA 1988.
2.03 Copyright (Unregistered Works): Full copyright protection under 17 U.S.C. § 302, CDPA 1988, and the Berne Convention without formality or notice.
2.04 Trademarks (Registered Marks): Protected under 15 U.S.C. § 1114/1125, Trade Marks Act 1994, Paris Convention and Madrid Protocol.
2.05 Trademarks (Unregistered Marks & Trade Dress): Common law trademarks, 15 U.S.C. § 1125(a), and UK passing off tort.
2.06 Trade Secrets: Protected under the Defend Trade Secrets Act (18 U.S.C. §§ 1831–1839), UTSA, and UK Trade Secrets Regulations 2018.
2.07 Database Rights: Sui generis database right (1997 Regulations) and US 17 U.S.C. § 101 compilations.
2.08 Moral Rights (UK): Paternity (§ 77), Integrity (§ 80), and Against False Attribution (§ 84) under CDPA 1988.

---

ARTICLE III — SCOPE OF COVERED WORKS
3.01 Software and Code (Source, object, bytecode, binaries, scripts, IaC specs).
3.02 Architecture and Design (Specs, diagrams, protocol definitions).
3.03 Cryptographic and Security Implementations (Algorithms, KDFs, signatures, ZK-proofs).
3.04 Databases and Data (Schemas, fixtures, collections).
3.05 AI and Machine Learning Assets (Prompt architectures, fine-tuning datasets, benchmark configs).
3.06 Forensic and Audit Methodologies (Audit frameworks, canary systems, telemetry).
3.07 Documentation and Publications.
3.08 Undisclosed and Confidential Works.
3.09 Works Without Notice.
3.10 Historical and Prior Versions.
3.11 Identification Mechanism via manifest at albertlane.net.

---

ARTICLE IV — USES REQUIRING A LICENSE AGREEMENT
Commercial Use (4.01), Government/Military Use (4.02), Academic/Research Use (4.03), AI Training and Inference (4.04), Indexing and Crawling (4.05), Distribution/Redistribution (4.06), Reverse Engineering (4.07), and Competitive Analysis (4.08) strictly require a written License Agreement signed by Albert Lane.

---

ARTICLE V — ILLUSTRATIVE APPLICATION TO A NAMED ENTITY (GOOGLE)
Prohibitions apply identically to automated crawlers (Googlebot, Google AdsBot), search indexing/display (Google Search, Books, Scholar), AI training/inference (Gemini, Bard), cloud/app distribution (GCP, Firebase, Workspace, Play Store), subject to statutory exposure under 17 U.S.C. § 504(c)(2) and 18 U.S.C. § 2319.

---

ARTICLE VI — STATUTORY FRAMEWORKS AND REMEDIES
Federal (17 U.S.C. § 501, 17 U.S.C. § 1201, 18 U.S.C. § 1030, 18 U.S.C. §§ 1831–1839, 15 U.S.C. § 1114/1125, 18 U.S.C. § 2319), State (Oregon ORS 164.377, ORS 646.461), UK (CDPA 1988, Computer Misuse Act 1990, Trade Marks Act 1994, Trade Secrets Regs 2018), and International Treaties (Berne, TRIPS, WCT, USMCA).

---

ARTICLE VII-XV — JURISDICTION, GOVERNANCE, AND ENFORCEMENT
Primary Jurisdiction: State of Oregon, USA
Secondary Jurisdiction: England and Wales, UK
Rights Holder: Albert Lane (albertlane.net)
Filing Reference: SEC Whistleblower No. 17684-273-411-436`;

  const noticeContent = `================================================================================
ALBERT LANE PROPRIETARY SOFTWARE SUITE & INTELLECTUAL PROPERTY DECLARATION
================================================================================
Copyright (c) 2026 Albert Lane (albertlane.net). ALL RIGHTS RESERVED.

PROVENANCE: Albert Lane (gmail@albertlane.net)
FILING REFERENCE: SEC Whistleblower No. 17684-273-411-436
CANONICAL AUTHORITY: https://provenance.albertlane.net/.provenance.jsonld
MAGIC HEADER: 0x3F8F9A1B2C3D | RFC 0103 Full-Duplex Kernel

NOTICE:
This codebase and all associated artifacts, source files, and compilation targets 
constitute strictly confidential and proprietary intellectual property of Albert Lane.
No license is granted without a written agreement signed by Albert Lane.`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'declaration' ? declarationContent : noticeContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="license-viewer-section" className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-700" />
          <h2 className="text-sm font-semibold text-zinc-900">
            Albert Lane Proprietary Software License & IP Declaration
          </h2>
          <span className="text-[11px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
            SEC Whistleblower #17684-273-411-436
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-200/70 p-0.5 rounded-lg text-xs">
            <button
              id="license-tab-declaration"
              onClick={() => setActiveTab('declaration')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'declaration'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Full Declaration
            </button>
            <button
              id="license-tab-notice"
              onClick={() => setActiveTab('notice')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'notice'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Header Notice
            </button>
          </div>

          <button
            id="copy-license-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto">
        <pre className="whitespace-pre-wrap leading-relaxed">
          {activeTab === 'declaration' ? declarationContent : noticeContent}
        </pre>
      </div>

      <div className="p-3 bg-amber-50/50 border-t border-amber-200/40 text-[11px] text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Complete reservation of all rights under 17 U.S.C. § 302, CDPA 1988, DTSA, and Berne Convention.</span>
        </div>
        <span className="font-mono text-zinc-500 text-[10px]">Governing Law: Oregon, USA & UK</span>
      </div>
    </div>
  );
};
