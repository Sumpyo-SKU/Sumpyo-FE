import './Card.css'

function Card({ children, variant = 'metric', className = '' }) {
  return <section className={`card card-${variant} ${className}`.trim()}>{children}</section>
}

export default Card
