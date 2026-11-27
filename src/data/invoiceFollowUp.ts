export type ReminderTone = "friendly" | "professional" | "firm";
export type ReminderStage = "first" | "second" | "final";

export interface InvoiceFollowUpInput {
  senderName: string;
  clientName: string;
  invoiceNumber: string;
  projectName: string;
  amountUsd: number;
  dueDateIso: string;
  daysOverdue: number;
  tone: ReminderTone;
  stage: ReminderStage;
  paymentMethodNote: string;
}

export interface GeneratedReminder {
  subject: string;
  body: string;
  timeline: {
    stepLabel: string;
    dateIso: string;
    action: string;
    active: boolean;
  }[];
}

export interface InvoiceGuidePage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  searchIntent: string;
  whenToSend: string;
  defaultDaysOverdue: number;
  defaultTone: ReminderTone;
  defaultStage: ReminderStage;
  keyMistake: string;
  recommendedNextStep: string;
  tips: string[];
}

export const DEFAULT_INVOICE_INPUT: InvoiceFollowUpInput = {
  senderName: "Alex Mercer — Northstar Digital",
  clientName: "Jordan",
  invoiceNumber: "INV-2026-08",
  projectName: "Marketing Website Redesign",
  amountUsd: 1850,
  dueDateIso: "2026-11-13",
  daysOverdue: 14,
  tone: "professional",
  stage: "second",
  paymentMethodNote: "ACH / bank details or payment link included in original PDF",
};

export function formatCurrencyUsd(amount: number): string {
  const safe = Number.isFinite(amount) && amount >= 0 ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(safe);
}

export function addDaysToIso(dateIso: string, deltaDays: number): string {
  const parsed = new Date(`${dateIso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return dateIso;
  parsed.setUTCDate(parsed.getUTCDate() + deltaDays);
  return parsed.toISOString().slice(0, 10);
}

export function generateInvoiceReminder(
  input: InvoiceFollowUpInput
): GeneratedReminder {
  const amountStr = formatCurrencyUsd(input.amountUsd);
  const inv = input.invoiceNumber.trim() || "INV-2026-08";
  const client = input.clientName.trim() || "there";
  const sender = input.senderName.trim() || "Your Studio";
  const project = input.projectName.trim() || "our recent project";
  const due = input.dueDateIso || "the due date";
  const days = Math.max(1, Math.round(input.daysOverdue || 1));
  const payNote =
    input.paymentMethodNote.trim() ||
    "the payment link or bank details on the original invoice";

  let subject = "";
  let opening = "";
  let middle = "";
  let closing = "";

  if (input.stage === "first") {
    subject =
      input.tone === "friendly"
        ? `Quick check-in: Invoice ${inv} (${amountStr})`
        : input.tone === "firm"
        ? `Payment Reminder: Invoice ${inv} Due ${due}`
        : `Following up on Invoice ${inv} — ${project}`;
  } else if (input.stage === "second") {
    subject =
      input.tone === "friendly"
        ? `Checking back on Invoice ${inv} (${days} days past due)`
        : input.tone === "firm"
        ? `Second Notice: Invoice ${inv} Now ${days} Days Past Due (${amountStr})`
        : `Second Follow-Up: Invoice ${inv} for ${project} (${amountStr})`;
  } else {
    subject =
      input.tone === "friendly"
        ? `Status check on Invoice ${inv} before we close this cycle`
        : input.tone === "firm"
        ? `Final Project Reminder: Invoice ${inv} (${amountStr}) — Work Pause Notice`
        : `Final Follow-Up: Outstanding Balance on Invoice ${inv} (${amountStr})`;
  }

  if (input.tone === "friendly") {
    opening = `Hi ${client},\n\nHope your week is going well.`;
  } else if (input.tone === "professional") {
    opening = `Hi ${client},\n\nI'm following up on Invoice ${inv} for ${project}.`;
  } else {
    opening = `Hi ${client},\n\nI'm reaching out regarding the open balance on Invoice ${inv} for ${project}.`;
  }

  if (input.stage === "first") {
    if (input.tone === "friendly") {
      middle = `I'm wrapping up weekly bookkeeping and noticed Invoice ${inv} for ${amountStr} (due ${due}, now ${days} days past due) is still showing open. In case it slipped past your inbox, you can settle it via ${payNote}.`;
      closing = `Could you let me know when payment is scheduled? Happy to resend the PDF if needed.`;
    } else if (input.tone === "professional") {
      middle = `Our records show ${amountStr} was due on ${due} and is currently ${days} days past due. Payment can be processed using ${payNote}.`;
      closing = `Please reply with the expected payment date or let me know if your accounting team needs another copy of the invoice.`;
    } else {
      middle = `Invoice ${inv} for ${amountStr} reached its due date on ${due} (${days} days ago) and remains unpaid. Please confirm remittance using ${payNote}.`;
      closing = `Kindly confirm when funds will be released so we can keep the project schedule on track.`;
    }
  } else if (input.stage === "second") {
    if (input.tone === "friendly") {
      middle = `Just bumping Invoice ${inv} (${amountStr}, due ${due}) back to the top of your inbox—it is now ${days} days past due. If it's already queued with accounts payable, thank you! Otherwise, details are via ${payNote}.`;
      closing = `Could you share a quick status update on when it will clear this week?`;
    } else if (input.tone === "professional") {
      middle = `This is a second reminder that ${amountStr} under Invoice ${inv} (due ${due}) is now ${days} days overdue. If payment has already been initiated, please share the confirmation reference.`;
      closing = `Otherwise, please schedule settlement via ${payNote} and confirm your target payment date by Friday.`;
    } else {
      middle = `Invoice ${inv} for ${amountStr} (originally due ${due}) is now ${days} days past due despite our earlier check-in. Prompt settlement is appreciated via ${payNote}.`;
      closing = `Please provide an exact payment date within the next 48 hours so there are no delays to upcoming deliverables.`;
    }
  } else {
    if (input.tone === "friendly") {
      middle = `We still haven't received payment for Invoice ${inv} (${amountStr}), which was due ${due} (${days} days past due). To keep our studio workload balanced, we pause active deliverables until open invoices are cleared.`;
      closing = `If anything is holding up approval via ${payNote}, please let me know today so we can resolve it quickly.`;
    } else if (input.tone === "professional") {
      middle = `Invoice ${inv} for ${amountStr} (due ${due}) has reached ${days} days past due. Per our standard project rhythm, we temporarily pause new milestone work when an invoice remains open beyond this window.`;
      closing = `Please process payment via ${payNote} or send confirmation of the scheduled transfer by end of week so we can resume smoothly.`;
    } else {
      middle = `This is our final commercial reminder for Invoice ${inv} (${amountStr}, due ${due} — now ${days} days overdue). Effective immediately, any ongoing or queued project work is placed on hold until the balance clears via ${payNote}.`;
      closing = `Please reply with remittance confirmation as soon as payment is sent so we can reactivate your project slot.`;
    }
  }

  const body = `${opening}\n\n${middle}\n\n${closing}\n\nBest regards,\n${sender}`;

  const timeline = [
    {
      stepLabel: "Stage 1 · Gentle Nudge",
      dateIso: addDaysToIso(due, 3),
      action: "Friendly inbox check-in + re-attach invoice PDF",
      active: input.stage === "first",
    },
    {
      stepLabel: "Stage 2 · Direct Follow-Up",
      dateIso: addDaysToIso(due, 14),
      action: "Ask for a specific target payment date from AP / client",
      active: input.stage === "second",
    },
    {
      stepLabel: "Stage 3 · Final Reminder",
      dateIso: addDaysToIso(due, 21),
      action: "Pause additional project deliverables until open invoice clears",
      active: input.stage === "final",
    },
  ];

  return { subject, body, timeline };
}

export const INVOICE_GUIDE_PAGES: InvoiceGuidePage[] = [
  {
    slug: "overdue-invoice-reminder-email-template",
    title: "Overdue Invoice Reminder Email Template (Free Copy & Generator)",
    h1: "Overdue Invoice Reminder Email Template",
    metaDescription:
      "Copy-ready overdue invoice reminder emails for US freelancers and agencies. Customize tone, invoice amount, and days overdue with zero signup.",
    searchIntent: "Client is 7 to 30 days late on a project invoice",
    whenToSend: "Send immediately once an invoice passes its Net-15 or Net-30 due date without confirmation.",
    defaultDaysOverdue: 14,
    defaultTone: "professional",
    defaultStage: "second",
    keyMistake:
      "Apologizing for asking to be paid or sending a wall of frustration—both lower urgency and blur the payment link.",
    recommendedNextStep:
      "State the invoice number, exact USD balance, days overdue, payment method, and ask for a specific target payment date.",
    tips: [
      "Keep the subject line under 60 characters with the invoice number right up front.",
      "Include how to pay directly inside the follow-up so the client does not hunt through old attachments.",
      "End with a clear date question ('Can you share when this is scheduled to clear?') instead of 'Whenever you get a chance.'",
    ],
  },
  {
    slug: "polite-payment-reminder-email",
    title: "Polite Payment Reminder Email for Freelancers (Days 1–5 Overdue)",
    h1: "Polite Payment Reminder Email",
    metaDescription:
      "A warm, relationship-safe polite payment reminder template for your first check-in when a client misses an invoice due date by a few days.",
    searchIntent: "Good long-term client likely missed the email by mistake",
    whenToSend: "Send 2 to 5 days after the invoice due date while keeping collaboration completely warm.",
    defaultDaysOverdue: 4,
    defaultTone: "friendly",
    defaultStage: "first",
    keyMistake:
      "Waiting 20 days out of awkwardness—by then, the client's monthly AP batch already closed and you wait another cycle.",
    recommendedNextStep:
      "Treat the first note as an administrative check-in assuming good intent, while restating amount and payment options.",
    tips: [
      "Assume an honest inbox miss—most early overdue invoices are approval bottlenecks, not disputes.",
      "Reply in the same email thread where you sent the original deliverable or invoice if possible.",
      "Add deposits and clear Net terms to future SOWs with ScopeCraft so payment triggers happen automatically.",
    ],
  },
  {
    slug: "second-invoice-follow-up-email",
    title: "Second Invoice Follow-Up Email Template (10–20 Days Late)",
    h1: "Second Invoice Follow-Up Email",
    metaDescription:
      "Firm yet professional second follow-up email template when your first invoice reminder went unanswered.",
    searchIntent: "First polite reminder got zero reply after 7+ days",
    whenToSend: "Send 7 to 14 days after your initial reminder if neither payment nor a scheduled date arrived.",
    defaultDaysOverdue: 15,
    defaultTone: "professional",
    defaultStage: "second",
    keyMistake:
      "Repeating the exact same 'just checking in!' wording—clients recognize copy-paste nudges and ignore them again.",
    recommendedNextStep:
      "Ask explicitly whether your invoice is already queued in accounts payable or if someone else needs to approve it.",
    tips: [
      "Request a specific payment date by Friday rather than leaving the reply open-ended.",
      "Offer to resend a W-9 or updated billing PDF if their finance team requires it.",
      "CC the client's accounts payable email if you were originally only emailing a project manager.",
    ],
  },
  {
    slug: "freelance-client-payment-reminder",
    title: "Freelance Client Payment Reminder for Retainers & Milestones",
    h1: "Freelance Client Payment Reminder",
    metaDescription:
      "Tailored payment follow-up emails for freelance milestones, retainers, and sprint invoices without hurting the client relationship.",
    searchIntent: "Active retainer or milestone invoice blocking next phase work",
    whenToSend: "Send before starting the next milestone or monthly cycle when the prior invoice remains unpaid.",
    defaultDaysOverdue: 10,
    defaultTone: "professional",
    defaultStage: "first",
    keyMistake:
      "Continuing to ship Phase 2 deliverables for weeks while Phase 1 remains unpaid—this erases your commercial leverage.",
    recommendedNextStep:
      "Tie payment confirmation cleanly to starting the next milestone batch.",
    tips: [
      "Separate project work into explicit milestones inside your SOW before kickoff.",
      "Never criticize the client personally—frame payment settlement as a studio scheduling rule.",
      "Use RateCraft 3-tier proposals to make milestone payment schedules explicit upfront.",
    ],
  },
  {
    slug: "final-invoice-reminder-before-escalation",
    title: "Final Invoice Reminder Email (Commercial Work-Pause Notice)",
    h1: "Final Invoice Reminder Before Pausing Work",
    metaDescription:
      "Calm, firm final commercial reminder template to pause ongoing deliverables until an overdue balance is settled—no empty threats.",
    searchIntent: "Invoice 21–45+ days overdue after multiple unanswered follow-ups",
    whenToSend: "Send when an invoice exceeds 21+ days overdue after two previous polite/professional follow-ups.",
    defaultDaysOverdue: 28,
    defaultTone: "firm",
    defaultStage: "final",
    keyMistake:
      "Making dramatic legal threats you do not intend to act on, or mixing formal statutory claims you are not qualified to quote.",
    recommendedNextStep:
      "Use clear, calm commercial language confirming that ongoing deliverables are paused until payment clears.",
    tips: [
      "Keep every sentence factual: invoice ID, amount, due date, days overdue, and work-hold status.",
      "Pause active Slack/Figma/repo handoffs calmly until remittance confirmation arrives.",
      "For formal legal collection or statutory claims in your jurisdiction, always consult a licensed attorney.",
    ],
  },
];
