import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';

class Lobby extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            myPlayer: []
            }
      }
      

      componentDidMount = () => {
        this.props.socket.on('new-player',(data) => {
            console.log('new player received', this)
            this.setState({'users': data})
          })

          this.props.socket.on('my-player',(data) => {
            console.log('my player received', this)
            this.setState({'myPlayer': data})
          })
      
      }

      clientID = (num) => {
        let users = this.state.users;
        let userIDs = users.map((cur, index) => {
          console.log(cur.id)
          return cur.id
        })
        // console.log('poop1:', this.state.users.length)
        // console.log('poop2:', this.state.users[3])
        // return this.state.users[0];
        console.log('id', userIDs)
        return userIDs
      }
      // testingID()

      usernameClient = () => {
        // console.log('id', list2)
        let users = this.state.users;
        let usernamesClient = users.map((cur, index) => {
          // console.log(cur.username)
          return <p key={index}>{cur.username}</p>
        })
        // console.log('poop1:', this.state.users.length)
        // console.log('poop2:', this.state.users[3])
        // return this.state.users[0];
        console.log('list', usernamesClient)
        return usernamesClient
      }

      myClient = () => {
        // console.log('id', list2)
        let poop = this.state.myPlayer;
        let myPlayerName = poop.map((cur, index) => {
          // console.log(cur.username)
          return <p key={index}>{cur.username}</p>
        })
        // console.log('poop1:', this.state.users.length)
        // console.log('poop2:', this.state.users[3])
        // return this.state.users[0];
        console.log('list', myPlayerName)
        return myPlayerName
      }

    startGame = () => {
            this.props.socket.emit('start-game');
    }
// current.map 

    render() {
      // let poop = this.state.users;
      // let list = poop.map(cur => {
      //   console.log(cur.username)
      //   return <p key={cur.toString()}>{cur.username}</p>
      // })
      
        return (
          <div className="container mt-5">
              <div className="row">
                <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                <h2 className="text-center text-light">Lobby</h2>
                  <div className="card shadow mt-4 pt-3 pb-3">
                    <div className="card-body">
                      <h3>Username: {this.myClient()}</h3>
                      <h3>List: {this.usernameClient()}</h3>
                      {console.log('state', this.state)}
                      <h3>Players in lobby: {this.state.users.length} </h3>
                    </div> 
                  </div>
                </div>
              </div>
              <button type='button' onClick={() => { this.startGame() }} className="btn btn-fill btn-block mt-5">Start Game</button>
          </div>
              
        )
    }
}
// emit start game message
export default socketConnect(Lobby);