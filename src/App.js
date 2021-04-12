import React, { Component } from 'react'
// Importing Tensor Flow Library
import '@tensorflow/tfjs';
const mobilenet = require('@tensorflow-models/mobilenet')
// Classification Variable
let net
// React Class
export default class App extends Component {
    // Initalizing the states (not using any props)
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            result: {
                'name': null,
                'prob': null,
            },
            group: '',
            loading: false,
        }
        this.handleChange = this.handleChange.bind(this)
    }
    // Called when image is uploaded to detect what the object is.
    handleChange(event) {
        // Setting the image state to the one we upload
        this.setState({
            image: URL.createObjectURL(event.target.files[0]),
        })
        // Runs tensor flow object detection
        this.app().then(value => {
            // Setting the state of the results from the app return
            this.setState({
                loading: false,
                // for result were parsing through the json response of the tensor flow response
                result: {'name': value[0]['className'], 'prob': value[0]['probability']},
            })
            // Calling the whatGroup function to get the group of the food
            this.whatGroup(value[0]['className'])
        })
    }
    // Tensor flow object detection
    app = async () => {
        this.setState({loading: true})
        const img = document.getElementById('img');

        net = await mobilenet.load();
        // Returning results
        return await net.classify(img);
    }

    whatGroup = (item) => {
        // Array object that contains all the groups and foods
        let menu = [
            {appetizer: "salad"},
            {appetizer: "olives"},
            {appetizer: "soup"},
            {appetizer: "eggs"},
            {appetizer: "bread"},
            {appetizer: "cheese"},
            {appetizer: "orange"},
            {main: "potpie"},
            {main: "chicken"},
            {main: "meatloaf"},
            {main: "pasta"},
            {main: "sandwich"},
            {main: "brocoli"},
            {main: "burger"},
            {dessert: "cookie"},
            {dessert: "waffles"},
            {dessert: "trifle"},
            {dessert: "brownie"},
            {dessert: "chocolate"},
            {dessert: "cake"},
            {dessert: "icecream"},
        ]
        // Doing a loop through every item (object) in the array
        menu.forEach(element => {
            // Object.values() method returns an array of a given object's
            // Then we verify if it is included in that array with the indexOf() method
            if (Object.values(element).indexOf(item.toLowerCase()) > -1) {
                // Setting the state to the group by property name. Example: "main" is the property name
                this.setState({
                    group: Object.getOwnPropertyNames(element).toString()
                })
            }
        });
    }
    // Here's where we render what goes on the screen
    render() {
        let {name, prob} = this.state.result;
        let {loading, group} = this.state;
        return (
            <div>
                {/* Viewing the image that you uploaded */}
                <img crossOrigin='anonymous' id={'img'} alt="img" src={this.state.image}/>
                <div>
                    {/* Uploading Image */}
                    <input onChange={this.handleChange} id='uploaded' type='file' accept="image/png, image/jpeg"/>
                </div>
                {/* If loading is false then show the results */}
                {loading ?
                    <div>
                        <h1>Loading Results</h1>
                    </div>
                    :
                    <div>
                        {/* All the results */}
                        <h5>{name === null ? null : `Name: ${name.toUpperCase()}`}</h5>
                        <h5>{group === '' ? null : `Group: ${group.toUpperCase()}`}</h5>
                        <h5>{prob === null ? null : `Confidence: ${(prob * 100).toFixed(2)}%`}</h5>
                    </div>
                }
            </div>
        )
    }
}