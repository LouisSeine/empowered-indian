import { Link } from 'react-router-dom'
import './Home.css'
import MailingListForm from './MPLADS/components/Common/MailingListForm'
import SiteFooter from './common/SiteFooter'

function Home() {
  return (
    <div className="home-page">
      <header className="header">
        <div className="header-container">
          <h1 className="logo">Empowered Indian</h1>
          <p className="tagline">Making our government visible, searchable, and accountable</p>
        </div>
      </header>
      
      <main className="main">
        <div className="main-container">
          <div className="construction-content">
            <div className="status-indicators">
              <div className="status-card available">
                <div className="status-icon">📊</div>
                <h3>MPLADS Dashboard</h3>
                <p className="status-label">Now Available</p>
                <p className="status-description">
                  Track MP fund utilization, project progress, and expenditure patterns across constituencies.
                </p>
                <Link to="/mplads" className="status-cta-button">
                  View Dashboard
                </Link>
              </div>
              
              <div className="status-card wip">
                <div className="status-icon">🚧</div>
                <h3>MLALADS Dashboard</h3>
                <p className="status-label">Work in Progress</p>
                <p className="status-description">
                  MLA Local Area Development fund tracking - coming soon to provide state-level transparency.
                </p>
                <button className="status-cta-button disabled" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
            
            <div className="mission">
              <p>
                <strong>Our Mission:</strong> To create a platform that makes government data 
                accessible, understandable, and actionable for every Indian citizen.
              </p>
            </div>
            
            <div className="cta">
              <p>
                Subscribe to receive new feature launches, data insights, and transparency reports —
                thoughtfully curated and sent occasionally. No spam, unsubscribe anytime.
              </p>
              <MailingListForm />
            </div>
          </div>
        </div>
      </main>
      
      <SiteFooter className="home-footer" />
    </div>
  )
}

export default Home
