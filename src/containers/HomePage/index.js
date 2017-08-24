import React, { Component } from 'react';
import { Col, Grid, Row, Panel, Button, Modal, Image, Well } from 'react-bootstrap';
import firebase from 'firebase';
import axios from 'axios';
import './styles.css';


//import component
import Header from './../../components/Header'
import Maps from './../../components/Maps'

const config = {
    apiKey: "AIzaSyBz_1-N2nD5PoFI4YiUbnAFZzGJzTUAS2Q",

    // Only needed if using Firebase Realtime Database (which we will be in this example)
    databaseURL: "https://idontknow-ebad8.firebaseio.com",

    // Only needed if using Firebase Authentication
    authDomain: "idontknow-ebad8.firebaseapp.com",

    // Only needed if using Firebase Storage
    storageBucket: "idontknow-ebad8.appspot.com"
  };
firebase.initializeApp(config);



class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            selectedReport: false,
            showModal: false,
            data: [],
            markers: [],
            fullmarkers: [],
            done: []
        }
    }
    onDetailClick = (selectedReport) => {
        this.setState({ selectedReport })
        this.openModal()
        let markers = [{
            position: selectedReport.position,
            key: selectedReport._key,
            defaultAnimation: 2,
        }]
        this.setState({markers})
    }
    onSeeMarker = (selectedReport) => {
        let markers = [{
            position: selectedReport.position,
            key: selectedReport._key,
            defaultAnimation: 2,
        }]
        this.setState({markers})
    }

    closeModal = () => {
        this.setState({ showModal: false });
        this.setState({ selectedReport: false })        
    }

    openModal = () => {
        this.setState({ showModal: true });
    }

    onAllMarkers = () => {
        this.setState({ markers: this.state.fullmarkers })
    }
    onProcessClick = (key, status) => {
        this.closeModal()
        axios.patch(`https://idontknow-ebad8.firebaseio.com/reports/${key}/.json`, {
            status: status,
        })
        .then(function (response) {
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    componentWillMount(){
        var ref = firebase.database().ref("reports").orderByChild('status');
        ref.on('value', (snap) => {
            var items = []
            var done = []
            var markers = []
            snap.forEach((child) => {
                if(child.val().status === 'done'){
                    done.push({
                        _key: child.key,
                        title: child.val().title,
                        user: child.val().user,
                        department: child.val().department,
                        description: child.val().description,
                        image_url: child.val().image_url,
                        address: child.val().address,
                        status: child.val().status,
                        position:{
                            lat: child.val().lat,
                            lng: child.val().lon
                        }
                    })
                }else{
                    items.push({
                        _key: child.key,
                        title: child.val().title,
                        user: child.val().user,
                        department: child.val().department,
                        description: child.val().description,
                        image_url: child.val().image_url,
                        address: child.val().address,
                        status: child.val().status,
                        position:{
                            lat: child.val().lat,
                            lng: child.val().lon
                        }
                    })
                    markers.push({
                        position: {
                            lat: child.val().lat,
                            lng: child.val().lon,
                        },
                        key: child.key,
                        defaultAnimation: 2,
                    })
                }
            })
            this.setState({ 
                data: items,
                markers: markers,
                fullmarkers: markers,
                done: done
            })
        })
    }

    render() {
    const { selectedReport, data, done } = this.state
    return (
        <div>
            <div style={{height: 70}} >
                <Header />
            </div>
            <Grid bsClass="container-fluid">
            <Row>
                <Col md={9}>
                <div style={{width: '100%', height: '560px'}}>
                    <Maps markers={this.state.markers} />
                </div>
                </Col>
                <Col md={3} style={{ height: '560px', overflowY:'scroll' }} >
                <Button bsStyle="primary" block style={{ marginTop:10, marginBottom:10 }} onClick={() => this.onAllMarkers()} >All Markers</Button>
                { data.map((report, index) => {
                    return(
                        <Panel key={index} header={report.user.username} bsStyle={ report.status === 'process' ? 'warning' : report.status === 'done' ? 'success' : 'danger' }>
                            <Col md={12} style={{ textAlign: 'center' }} >
                                {report.title}
                            </Col>
                            <Col md={6}>
                            <Button bsStyle="primary" block style={{ marginTop:10 }} onClick={() => this.onDetailClick(report)} >Detail</Button>
                            </Col>
                            <Col md={6}>
                            <Button bsStyle="primary" block style={{ marginTop:10 }} onClick={() => this.onSeeMarker(report)} >See Marker</Button>
                            </Col>
                        </Panel>
                    )
                })
                }
                <h4>Completed Mission</h4>
                { done.map((report, index) => {
                    return(
                        <Panel key={index} header={report.user.username} bsStyle={ report.status === 'process' ? 'warning' : report.status === 'done' ? 'success' : 'danger' }>
                             <Col md={12} style={{ textAlign: 'center' }} >
                                {report.title}
                            </Col>
                            <Col md={6}>
                            <Button bsStyle="primary" block style={{ marginTop:10 }} onClick={() => this.onDetailClick(report)} >Detail</Button>
                            </Col>
                            <Col md={6}>
                            <Button bsStyle="primary" block style={{ marginTop:10 }} onClick={() => this.onSeeMarker(report)} >See Marker</Button>
                            </Col>
                        </Panel>
                    )
                })
                }
                </Col>
            </Row>
            </Grid>
            { /* Modal */}
            <Modal show={this.state.showModal} onHide={this.closeModal}>
                {selectedReport && (
                    <div>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedReport.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{textAlign: '-webkit-center'}}>
                            <Image src={selectedReport.image_url} responsive style={{ maxHeight:250 }} />
                            <p style={{ textAlign: 'justify', marginTop: 15 }} >{selectedReport.description}</p>
                             <Well>{selectedReport.address}</Well>
                        </Modal.Body>
                        <Modal.Footer>
                            { selectedReport.status === "pending" ?
                                <Button bsStyle="primary" onClick={() => this.onProcessClick(selectedReport._key, 'process')} >Process</Button>:
                                selectedReport.status === 'process' &&
                                <Button bsStyle="success" onClick={() => this.onProcessClick(selectedReport._key, 'done')}>Done</Button>
                            }
                            <Button bsStyle="danger" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </div>
                )
                }
            </Modal>
        </div>
    );
    }
}

export default App;
