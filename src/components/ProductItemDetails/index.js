// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetailsList: {},
    similarProductList: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    ratings: data.ratings,
    availability: data.availability,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const api = `https://apis.ccbp.in/products/${id}`

    const options = {
      method: 'GET',
      headers: {
        Autherization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(api, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductList = fetchedData.simimar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )

      this.setState({
        productDetailsList: updatedData,
        similarProductList: updatedSimilarProductList,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderingLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderingFailure = () => (
    <div className="container143">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="image1"
        alt="error view"
      />
      <h1 className="heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button1">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrement = () => {
    const {quantity} = this.state

    if (quantity > 1) {
      this.setState(previousState => ({quantity: previousState.quantity - 1}))
    }
  }

  onIncrement = () => {
    this.setState(previousState => ({quantity: previousState.quantity + 1}))
  }

  renderingProductView = () => {
    const {productDetailsList, similarProductList, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      brand,
      totalReviews,
      rating,
      description,
      availability,
    } = productDetailsList

    return (
      <div className="container">
        <div className="mini-container">
          <img src={imageUrl} className="image2" alt="product" />
          <div className="mini-container1">
            <h1 className="heading1">{title}</h1>
            <p className="paragraph1">Rs {price}</p>
            <div className="mini-container3">
              <div className="mini-container4">
                <p className="paragraph2">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="image3"
                  alt="star"
                />
              </div>
              <p className="paragraph4">{totalReviews} Reviews</p>
            </div>
            <p className="paragarph4">{description}</p>
            <div className="mini-container5">
              <p className="paragraph3">Availability</p>
              <p className="paragraph3">{availability}</p>
            </div>
            <div className="mini-container5">
              <p className="paragraph3">Brand</p>
              <p className="paragraph3">{brand}</p>
            </div>
            <hr className="line" />
            <div className="mini-container5">
              <label htmlFor = "text">
              <button
                type="button"
                id = "text"
                className="button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="name" />
              </button>
              </label>
              <p className="paragraph3">{quantity}</p>
              <label htmlFor = "texts">
              <button
                type="button"
                id = "texts"
                className="button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="name" />
              </button>
              <button type="button" className="buton2">
                ADD TO CART
              </button>
              </label>
            </div>
          </div>
          <h1 className="headibng2">Simiar Products</h1>
          <ul className="list-items">
            {similarProductList.map(eachProduct => (
              <SimilarProductItem
                key={eachProduct.id}
                productDetails={eachProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderingProductView()
      case apiStatusConstants.failure:
        return this.renderingFailure()
      case apiStatusConstants.inProgress:
        return this.renderingLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="container420">{this.renderingProductView}</div>
      </>
    )
  }
}

export default ProductItemDetails
