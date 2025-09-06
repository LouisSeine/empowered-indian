import { FiSearch, FiFilter, FiRefreshCw, FiX } from 'react-icons/fi';
import { FilterLoadingState } from './LoadingState';
import './ResultsFeedback.css';

const ResultsFeedback = ({
  isLoading = false,
  hasResults = true,
  totalResults = 0,
  searchQuery = '',
  activeFilters = [],
  onClearSearch = null,
  onClearFilters = null,
  onRetry = null,
  resultType = 'items',
  showLoadingInline = true
}) => {
  const activeFilterCount = activeFilters.length;
  const hasSearch = Boolean(searchQuery);
  const hasFilters = activeFilterCount > 0;

  // Loading state
  if (isLoading && showLoadingInline) {
    return (
      <div className="results-feedback results-loading">
        <FilterLoadingState 
          filtersCount={activeFilterCount}
          message={hasSearch ? `Searching for "${searchQuery}"...` : 'Loading...'}
        />
      </div>
    );
  }

  // No results state
  if (!hasResults && !isLoading) {
    return (
      <div className="results-feedback results-empty">
        <div className="results-empty-icon">
          <FiSearch />
        </div>
        
        <h3 className="results-empty-title">
          No {resultType} found
        </h3>
        
        <div className="results-empty-message">
          {hasSearch && hasFilters ? (
            <>
              No {resultType} match your search for <strong>"{searchQuery}"</strong> with current filters.
            </>
          ) : hasSearch ? (
            <>
              No {resultType} match your search for <strong>"{searchQuery}"</strong>.
            </>
          ) : hasFilters ? (
            <>
              No {resultType} match your current filter criteria.
            </>
          ) : (
            <>
              No {resultType} available at this time.
            </>
          )}
        </div>

        <div className="results-empty-suggestions">
          <p>Try:</p>
          <ul>
            {hasSearch && (
              <li>Using different search terms</li>
            )}
            {hasFilters && (
              <li>Removing some filters</li>
            )}
            <li>Checking your spelling</li>
            <li>Using more general terms</li>
          </ul>
        </div>

        <div className="results-empty-actions">
          {hasSearch && onClearSearch && (
            <button 
              className="results-action-btn results-action-secondary"
              onClick={onClearSearch}
              aria-label="Clear search"
            >
              <FiX />
              Clear Search
            </button>
          )}
          
          {hasFilters && onClearFilters && (
            <button 
              className="results-action-btn results-action-secondary"
              onClick={onClearFilters}
              aria-label="Clear all filters"
            >
              <FiFilter />
              Clear Filters
            </button>
          )}
          
          {onRetry && (
            <button 
              className="results-action-btn results-action-primary"
              onClick={onRetry}
              aria-label="Retry loading"
            >
              <FiRefreshCw />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results found state
  if (hasResults && !isLoading) {
    return (
      <div className="results-feedback results-summary">
        <div className="results-summary-content">
          <span className="results-count">
            {totalResults.toLocaleString()} {resultType}
            {hasSearch || hasFilters ? ' found' : ' available'}
          </span>
          
          {(hasSearch || hasFilters) && (
            <div className="results-context">
              {hasSearch && (
                <span className="results-search-context">
                  for "<strong>{searchQuery}</strong>"
                </span>
              )}
              
              {hasFilters && (
                <span className="results-filter-context">
                  with {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        {(hasSearch || hasFilters) && (
          <div className="results-summary-actions">
            {hasSearch && onClearSearch && (
              <button 
                className="results-clear-btn"
                onClick={onClearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                <FiX />
              </button>
            )}
            
            {hasFilters && onClearFilters && (
              <button 
                className="results-clear-btn"
                onClick={onClearFilters}
                aria-label="Clear filters"
                title="Clear all filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ResultsFeedback;