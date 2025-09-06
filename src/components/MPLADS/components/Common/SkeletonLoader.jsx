import './SkeletonLoader.css';

const SkeletonLoader = ({ 
  type = 'text', 
  width = '100%', 
  height = '1rem',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-subtitle" />
            </div>
            <div className="skeleton-body">
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: '80%' }} />
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton skeleton-cell" />
              ))}
            </div>
            {[1, 2, 3, 4, 5].map(row => (
              <div key={row} className="skeleton-table-row">
                {[1, 2, 3, 4].map(cell => (
                  <div key={cell} className="skeleton skeleton-cell" />
                ))}
              </div>
            ))}
          </div>
        );
      
      case 'chart':
        return (
          <div className="skeleton-chart">
            <div className="skeleton skeleton-chart-title" />
            <div className="skeleton skeleton-chart-area" />
          </div>
        );
      
      case 'stat':
        return (
          <div className="skeleton-stat">
            <div className="skeleton skeleton-stat-value" />
            <div className="skeleton skeleton-stat-label" />
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton-list-item">
                <div className="skeleton skeleton-avatar" />
                <div className="skeleton-list-content">
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div 
            className="skeleton skeleton-text" 
            style={{ width, height }}
          />
        );
    }
  };

  return (
    <div className={`skeleton-loader ${className}`}>
      {count > 1 ? (
        Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-item">
            {renderSkeleton()}
          </div>
        ))
      ) : (
        renderSkeleton()
      )}
    </div>
  );
};

export default SkeletonLoader;