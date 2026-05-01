import { useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('ready')
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [log, setLog] = useState([
    'System ready.',
    'Waiting for operator to start calibration.',
  ])

  const steps = [
    'Checking connection',
    'Reading device information',
    'Applying calibration profile',
    'Verifying calibration output',
    'Finalizing',
  ]

  const startCalibration = () => {
    if (status === 'running') return

    setStatus('running')
    setStepIndex(0)
    setProgress(0)
    setLog(['Calibration started.', 'Checking connection...'])

    const timeline = [
      { delay: 900, step: 0, progress: 20, message: 'Connection verified.' },
      { delay: 1900, step: 1, progress: 40, message: 'Device information loaded.' },
      { delay: 3000, step: 2, progress: 65, message: 'Calibration profile applied.' },
      { delay: 4200, step: 3, progress: 85, message: 'Output verified within tolerance.' },
      { delay: 5400, step: 4, progress: 100, message: 'Calibration complete.' },
    ]

    timeline.forEach((item, index) => {
      setTimeout(() => {
        setStepIndex(item.step)
        setProgress(item.progress)
        setLog((prev) => [...prev, item.message])

        if (index === timeline.length - 1) {
          setStatus('success')
        }
      }, item.delay)
    })
  }

  const resetCalibration = () => {
    setStatus('ready')
    setStepIndex(0)
    setProgress(0)
    setLog([
      'System ready.',
      'Waiting for operator to start calibration.',
    ])
  }

  const currentStepLabel =
    status === 'ready'
      ? 'Awaiting operator input'
      : status === 'running'
      ? steps[stepIndex]
      : 'Calibration completed successfully'

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <div style={styles.appShell}>
        <header style={styles.header}>
          <div>
            <img
              src="/trigger_interactive_logo.svg"
              alt="Trigger Interactive Logo"
              style={styles.logo}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          <div style={styles.headerText}>
            <div style={styles.headerEyebrow}>Assembly Station Interface</div>
            <h1 style={styles.title}>Server Motor Calibrator</h1>
            <p style={styles.subtitle}>
            </p>
          </div>
        </header>

        <main style={styles.main}>
          <section style={styles.leftColumn}>
            <div style={styles.instructionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionPill}>Instructions</div>
                <h2 style={styles.sectionTitle}>Prepare and calibrate the device</h2>
                <p style={styles.sectionSubtext}>
                  Keep the process simple for the operator and reduce the chance of interruption.
                </p>
              </div>

              <div style={styles.stepList}>
                <StepItem number="1" text="Connect a single device to the computer using the required cable." />
                <StepItem number="2" text="Power on the device and verify it appears in the status panel." />
                <StepItem number="3" text="Select Start Calibration to begin the guided process." />
                <StepItem number="4" text="Allow the process to finish before disconnecting the device." />
              </div>
            </div>

            <div style={styles.warningCard}>
              <div style={styles.warningTop}>
                <div style={styles.warningIcon}>!</div>
                <div>
                  <div style={styles.warningTitle}>Important Warning</div>
                  <div style={styles.warningText}>
                    Do not disconnect the device, remove power, or shut down the computer during calibration. Interrupting the process may damage the unit or create an invalid calibration.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={styles.rightColumn}>
            <div style={styles.controlCard}>
              <div style={styles.controlHeader}>
                <div>
                  <div style={styles.controlEyebrow}>Current State</div>
                  <div style={styles.controlTitle}>{currentStepLabel}</div>
                </div>
                <div style={styles.stateBadge}>{status === 'success' ? 'PASS' : status === 'running' ? 'RUNNING' : 'READY'}</div>
              </div>

              <div style={styles.heroRow}>
                <div style={styles.heroIcon}>{status === 'success' ? '✓' : '↓'}</div>

                <div style={styles.heroDetails}>
                  <div style={styles.heroLabel}>Calibration Progress</div>
                  <div style={styles.heroPercent}>{progress}%</div>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              {status !== 'success' ? (
                <button
                  style={{
                    ...styles.primaryButton,
                    ...(status === 'running' ? styles.buttonDisabled : null),
                  }}
                  onClick={startCalibration}
                  disabled={status === 'running'}
                >
                  {status === 'running' ? 'CALIBRATING...' : 'START CALIBRATION'}
                </button>
              ) : (
                <button style={styles.secondaryButton} onClick={resetCalibration}>
                  RESET FOR NEXT DEVICE
                </button>
              )}
            </div>

            <div style={styles.bottomGrid}>
              <div style={styles.infoCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>Device Status</span>
                </div>
                <StatusRow label="Connection" value={status === 'ready' ? 'Ready' : 'Connected'} good />
                <StatusRow label="Connected Device" value="Server Motor A" />
                <StatusRow label="Firmware" value="v1.3.2" />
                <StatusRow label="Profile" value="Default Profile" />
                <StatusRow
                  label="Calibration Result"
                  value={status === 'success' ? 'Pass' : status === 'running' ? 'Running' : 'Pending'}
                  good={status === 'success'}
                />
              </div>

              <div style={styles.infoCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>Activity Log</span>
                </div>
                <div style={styles.logList}>
                  {log.map((item, index) => (
                    <div key={index} style={styles.logItem}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function StepItem({ number, text }) {
  return (
    <div style={styles.stepItem}>
      <div style={styles.stepNumber}>{number}</div>
      <div style={styles.stepText}>{text}</div>
    </div>
  )
}

function StatusRow({ label, value, good = false }) {
  return (
    <div style={styles.statusRow}>
      <span style={styles.statusLabel}>{label}</span>
      <span
        style={{
          ...styles.statusValue,
          ...(good ? styles.statusValueGood : null),
        }}
      >
        {value}
      </span>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%)',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    color: '#17212f',
    padding: '32px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGlowOne: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '999px',
    background: 'rgba(180, 35, 24, 0.08)',
    top: '-120px',
    right: '-80px',
    filter: 'blur(20px)',
  },
  backgroundGlowTwo: {
    position: 'absolute',
    width: '380px',
    height: '380px',
    borderRadius: '999px',
    background: 'rgba(30, 64, 175, 0.06)',
    bottom: '-120px',
    left: '-80px',
    filter: 'blur(20px)',
  },
  appShell: {
    maxWidth: '1320px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255,255,255,0.76)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '32px',
    padding: '30px',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.10)',
  },
  header: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '28px',
    alignItems: 'center',
    marginBottom: '28px',
  },
  logo: {
    width: '320px',
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  headerEyebrow: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#9aa4b2',
  },
  title: {
    margin: 0,
    fontSize: '40px',
    lineHeight: 1.05,
    fontWeight: '700',
    color: '#243040',
  },
  subtitle: {
    margin: 0,
    maxWidth: '620px',
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#667085',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: '22px',
    alignItems: 'start',
  },
  leftColumn: {
    display: 'grid',
    gap: '18px',
  },
  rightColumn: {
    display: 'grid',
    gap: '18px',
  },
  instructionCard: {
    background: 'linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)',
    border: '1px solid #e6ebf2',
    borderRadius: '28px',
    padding: '28px',
    boxShadow: '0 18px 36px rgba(17, 24, 39, 0.24)',
  },
  sectionHeader: {
    marginBottom: '22px',
  },
  sectionPill: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: '999px',
    background: '#f3f6fb',
    color: '#5b6675',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '14px',
  },
  sectionTitle: {
    margin: '0 0 8px 0',
    fontSize: '30px',
    fontWeight: '700',
    color: '#243040',
  },
  sectionSubtext: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#667085',
  },
  stepList: {
    display: 'grid',
    gap: '14px',
  },
  stepItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
    marginBottom: '12px',
  },
  stepNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#b42318',
    minWidth: '24px',
    textAlign: 'center',
  },
  stepText: {
    fontSize: '17px',
    lineHeight: 1.65,
    color: '#344054',
  },
  warningCard: {
    background: 'linear-gradient(180deg, #fff7f6 0%, #fff1ef 100%)',
    border: '1px solid #f3d1cb',
    borderRadius: '28px',
    padding: '22px 24px',
    boxShadow: '0 18px 36px rgba(17, 24, 39, 0.24)',
  },
  warningTop: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr',
    gap: '14px',
    alignItems: 'start',
  },
  warningIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '999px',
    background: '#b42318',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
  },
  warningTitle: {
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#b42318',
    marginBottom: '8px',
  },
  warningText: {
    fontSize: '16px',
    lineHeight: 1.65,
    color: '#6b2a24',
  },
  controlCard: {
    background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '28px',
    padding: '26px',
    color: '#17212f',
    boxShadow: '0 18px 36px rgba(17, 24, 39, 0.24)',
  },
  controlHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '18px',
    alignItems: 'start',
    marginBottom: '22px',
  },
  controlEyebrow: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(113, 128, 150, 0.8)',
    marginBottom: '8px',
  },
  controlTitle: {
    fontSize: '26px',
    lineHeight: 1.2,
    fontWeight: '700',
    maxWidth: '320px',
  },
  stateBadge: {
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'rgba(113, 128, 150, 0.1)',
    border: '1px solid rgba(113, 128, 150, 0.2)',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.12em',
  },
  heroRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '22px',
  },
  heroIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '22px',
    background: 'rgba(113, 128, 150, 0.1)',
    border: '1px solid rgba(113, 128, 150, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '38px',
    color: '#17212f',
  },
  heroDetails: {
    display: 'grid',
    gap: '8px',
  },
  heroLabel: {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(113, 128, 150, 0.8)',
  },
  heroPercent: {
    fontSize: '34px',
    fontWeight: '800',
    lineHeight: 1,
  },
  progressTrack: {
    width: '100%',
    height: '12px',
    background: 'rgba(113, 128, 150, 0.2)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #fb7185 0%, #ef4444 100%)',
    borderRadius: '999px',
    transition: 'width 0.35s ease',
  },
  primaryButton: {
    width: '100%',
    border: 'none',
    borderRadius: '18px',
    background: 'linear-gradient(180deg, #ef4444 0%, #b42318 100%)',
    color: '#fff',
    padding: '18px 20px',
    fontSize: '17px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    boxShadow: '0 16px 30px rgba(180, 35, 24, 0.34)',
  },
  secondaryButton: {
    width: '100%',
    border: 'none',
    borderRadius: '18px',
    background: 'linear-gradient(180deg, #ef4444 0%, #b42318 100%)',
    color: '#fff',
    padding: '18px 20px',
    fontSize: '17px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    boxShadow: '0 16px 30px rgba(180, 35, 24, 0.34)',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },
  infoCard: {
    background: 'linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)',
    border: '1px solid #e6ebf2',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 18px 36px rgba(17, 24, 39, 0.24)',
  },
  cardHeader: {
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#667085',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 0',
    borderBottom: '1px solid #eef2f6',
  },
  statusLabel: {
    fontSize: '14px',
    color: '#667085',
  },
  statusValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#344054',
  },
  statusValueGood: {
    color: '#067647',
  },
  logList: {
    display: 'grid',
    gap: '10px',
    maxHeight: '252px',
    overflowY: 'auto',
  },
  logItem: {
    padding: '12px 14px',
    borderRadius: '16px',
    background: '#f8fafc',
    border: '1px solid #e7edf3',
    color: '#475467',
    fontSize: '14px',
    lineHeight: 1.5,
  },
}
