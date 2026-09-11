import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, AlertOctagon, Clock } from 'lucide-react';

export default function StatusBadge({ status, label, size = 'normal' }) {
  const norm = String(status || '').toUpperCase();

  let badgeClass = 'badge-na';
  let Icon = HelpCircle;
  let text = label || status || 'Not Assessed';

  if (norm.includes('COMPLIANT') || norm === 'PASS' || norm === 'VERIFIED' || norm === 'COMPLETED') {
    badgeClass = 'badge-compliant';
    Icon = CheckCircle2;
    if (!label) text = norm === 'COMPLIANT_CANDIDATE' ? 'Compliant Candidate' : norm === 'VERIFIED' ? 'Verified' : 'Passed';
  } else if (norm.includes('REVIEW') || norm.includes('VERIFICATION') || norm === 'WARNING') {
    badgeClass = 'badge-review';
    Icon = AlertTriangle;
    if (!label) text = 'Needs Officer Verification';
  } else if (norm.includes('NON_COMPLIANCE') || norm === 'FAIL' || norm.includes('CONFLICT')) {
    badgeClass = 'badge-noncompliant';
    Icon = norm.includes('CONFLICT') ? AlertOctagon : XCircle;
    if (!label) text = norm.includes('CONFLICT') ? 'Conflicting Declaration' : 'Potential Non-Compliance';
  } else if (norm.includes('INCOMPLETE') || norm.includes('IN_PROGRESS')) {
    badgeClass = 'badge-incomplete';
    Icon = Clock;
    if (!label) text = 'Inspection Incomplete';
  } else if (norm.includes('NOT_ASSESSABLE') || norm.includes('INSUFFICIENT')) {
    badgeClass = 'badge-na';
    Icon = HelpCircle;
    if (!label) text = norm.includes('INSUFFICIENT') ? 'Evidence Insufficient' : 'Not Assessable';
  }

  const iconSize = size === 'small' ? 12 : 14;
  const fontSize = size === 'small' ? '0.7rem' : '0.75rem';
  const padding = size === 'small' ? '2px 6px' : '4px 8px';

  return (
    <span className={`badge-status ${badgeClass}`} style={{ fontSize, padding }}>
      <Icon size={iconSize} />
      <span>{text}</span>
    </span>
  );
}

