import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'Is LabelGuard a final legal verdict engine?',
      a: 'No. LabelGuard is strictly an assistive inspection tool. It extracts text, verifies against rules, and highlights potential non-compliances. The final determination and notice issuance remain entirely with the authorized human officer.'
    },
    {
      q: 'What happens if a package surface cannot be scanned due to damage?',
      a: 'The officer can mark the surface as "Damaged / Unreadable" or "Needs Recapture". The rule evaluator will classify affected declarations as "Evidence Insufficient" or "Not Assessable" rather than manufacturing a false violation.'
    },
    {
      q: 'How does the offline queue work during field inspections without cellular network?',
      a: 'The application caches captured package images and inspection metadata in the browser local queue. When network connectivity is restored, the officer can synchronize records with the central inspection database with one click.'
    },
    {
      q: 'How are tamper-evident evidence records preserved?',
      a: 'All uploaded and camera-captured images are immediately digested using SHA-256 cryptographic hashing. The hashes, timestamps, and officer IDs are permanently recorded alongside the inspection record.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Banner */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '54px 24px 48px'
      }}>
        <div className="container-max">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Support & Technical Inquiries
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '12px' }}>
            Contact & Support
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
            Technical support for field officers, regulatory questions, and platform assistance.
          </p>
        </div>
      </div>

      <div className="container-max" style={{ padding: '60px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', marginBottom: '60px' }}>
          {/* Form */}
          <div className="card-institutional" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Send a Query or Feedback
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Submit an operational question or report an OCR extraction anomaly.
            </p>

            {submitted ? (
              <div style={{
                padding: '24px',
                backgroundColor: 'var(--status-pass-bg)',
                border: '1px solid var(--status-pass-border)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={36} color="var(--status-pass-text)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--status-pass-text)', marginBottom: '6px' }}>
                  Query Submitted Successfully
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Thank you for your submission. Your query has been logged.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Officer Name / Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-institutional"
                      placeholder="Inspector Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="input-institutional"
                      placeholder="officer@domain.gov.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Department / Jurisdiction
                  </label>
                  <input
                    type="text"
                    className="input-institutional"
                    placeholder="Legal Metrology Department - Regional Enforcement Wing"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-institutional"
                    placeholder="LMPC Rule 6(1)(e) verification question"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="input-institutional"
                    placeholder="Describe your inquiry or packaging observation..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
                  <Send size={15} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Department Information Placeholder */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card-institutional" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
                Department Information [Placeholder]
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Official department information placeholder for state or central Legal Metrology enforcement bodies:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span>Legal Metrology Division, Department of Consumer Affairs [Administrative Office Placeholder]</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Mail size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span>support-labelguard@placeholder.gov.in</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span>Technical Helpdesk: 1800-XXX-XXXX [Placeholder]</span>
                </div>
              </div>
            </div>

            <div className="card-institutional" style={{ padding: '24px', backgroundColor: 'var(--bg-subtle)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Field Reporting Guidance
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                For non-compliant packaged commodities encountered during retail inspections, officers must preserve physical sample units, secure high-resolution photographs of all panels, and note dealer invoice details before formal seizure under Section 15 of Legal Metrology Act, 2009.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {faqs.map((f, idx) => (
              <div key={idx} className="card-institutional" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {f.q}
                  </h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '28px' }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

