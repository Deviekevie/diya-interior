import './Newsletter.css'

const Newsletter = () => {
  return (
    <div className='container'>
      <div className='review-wrapper'>
        <h1>
          What our<br/>
          <span className='yellow'>customers say</span>
        </h1>

        <div className='review-intro'>
          Real experiences from clients who trusted Diya Modular for their dream interiors.
        </div>

        <div className='review-cards'>
          <div className='review-card'>
            <h3>⭐ ⭐ ⭐ ⭐ ⭐</h3>
            <div className='review-text'>
              “Exceptional service! The design was exactly what we imagined.
              Timely delivery and great professionalism.”
            </div>
            <span>- Priya S.</span>
          </div>

          <div className='review-card'>
            <h3>⭐ ⭐ ⭐ ⭐ ⭐</h3>
            <div className='review-text'>
              “Diya Modular transformed our home beautifully.
              High-quality materials and a very friendly team.”
            </div>
            <span>- Naveen K.</span>
          </div>

          <div className='review-card'>
            <h3>⭐ ⭐ ⭐ ⭐ ⭐</h3>
            <div className='review-text'>
              “Amazing experience! They understood our needs perfectly.
              Highly recommended for modular interiors.”
            </div>
            <span>- Anusha R.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
