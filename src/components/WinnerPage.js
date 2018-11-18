import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class WinnerPage extends Component {

    render() {
      if (this.props.state.currentCorrectUsers.length === 0) {
        return (
          <div className="container mt-5">
              <div className="row text-center text-light">
                <div className="col-sm-12">
                  <h1 className="mt-5">There were no WINNERS!</h1>
                  <Link to={'/'} className="link-text btn"><button className="btn btn-fill"> Home </button></Link>
                </div>
              </div>
          </div>
        )

      } else if (this.props.state.currentCorrectUsers.length === 1) {

      return (
        <div className="container mt-5">
            <div className="row text-center text-light">
              <div className="col-sm-12">
                <h1 className="mt-5">There was {this.props.state.currentCorrectUsers.length} WINNER!</h1>
                <Link to={'/'} className="link-text btn"><button className="btn btn-fill"> Home </button></Link>
              </div>
            </div>
        </div>
      ) 
      
      } else if (this.props.state.currentCorrectUsers.length > 1) {
        return (
          <div className="container mt-5">
              <div className="row text-center text-light">
                <div className="col-sm-12">
                  <h1 className="mt-5">There were {this.props.state.currentCorrectUsers.length} WINNERS!</h1>
                  <Link to={'/'} className="link-text btn"><button className="btn btn-fill"> Home </button></Link>
                </div>
              </div>
          </div>
        )
      }
    }
}

export default WinnerPage
