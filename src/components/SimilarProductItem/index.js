// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, price, rating, brand, title} = productDetails

  return (
    <li className="list">
      <img src = {imageUrl} className = "image6" alt = {`similar product ${title}`} />
      <p className = "paragraph6">{title}</p>
      <p className = "paragraph6">by {brand}</p>  
      <div className = "container11">
        <p className = "paragraph3">Rs {price}</p>
        <div className = "container22">
        <p className = "praneetha">{rating}</p>
        <img src = "https://assets.ccbp.in/frontend/react-js/star-img.png " className = "image8" alt= "star" />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
