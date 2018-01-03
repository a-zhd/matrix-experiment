import React from "react";
import ReactDOM from "react-dom";
import {InputForm, BootstrapTable} from "./components/components.js";
import Matrix from "./matrix.js";
import {createMatrix, updateMatrix, autoFillMatrix, markDomens} from "./logic";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matrix: null,
            nsize: 0,
            msize: 0,
            probability: null,
            numberOfDomens: null,
            tableData: []
        };
        this.createMatrixData = this.createMatrixData.bind(this);
        this.autoFillMatrixData = this.autoFillMatrixData.bind(this);
        this.markDomens = this.markDomens.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextState.msize != this.state.msize ||
            nextState.nsize != this.state.nsize ||
            nextState.probability != this.state.probability
        ) return false;

        return true;
    }

    createMatrixData() {
        const model = createMatrix(this.state.nsize, this.state.msize);
        this.setState((s) => {
            return {
                matrix: s.matrix = model,
                numberOfDomens: s.numberOfDomens = null
            };
        });
    }

    autoFillMatrixData() {
        const model = autoFillMatrix(this.state.nsize, this.state.msize, this.state.probability);
        this.setState((s) => {
            return {matrix: s.matrix = model};
        });
    }

    markDomens() {
        const [domens, table, model] = markDomens(
            this.state.matrix, this.state.probability, this.state.tableData
        );
        this.setState((s) => {
            return {
                matrix: s.matrix = model,
                numberOfDomens: domens,
                tableData: table
            };
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-9">
                        <div className="row">
                            <div className="col-6">
                                <h1 className="display-4">Matrix</h1>
                            </div>
                            <div className="col">
                                <h1 className="display-4">{this.state.numberOfDomens}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 bg-light">
                        <div className="card bg-info m-card">
                            <div className="card-body">
                                <InputForm placeholder="Size N"
                                           class={"form-control form-control-sm"}
                                           inputProps={{
                                               onChange: event =>
                                                   this.setState({nsize: parseInt(event.target.value)}),
                                               type: "number",
                                               min: 1,
                                               max: 80
                                           }}/>
                                <InputForm placeholder="Size M"
                                           class={"form-control form-control-sm"}
                                           inputProps={{
                                               onChange: event =>
                                                   this.setState({msize: parseInt(event.target.value)}),
                                               type: "number",
                                               min: 1,
                                               max: 80
                                           }}/>
                                <button className="btn btn-dark btn-sm"
                                        onClick={this.createMatrixData}>
                                    Create matrix
                                </button>
                            </div>
                        </div>
                        <div className="card bg-info m-card">
                            <div className="card-body">
                                <InputForm placeholder="Probability"
                                           inputProps={{
                                               onChange: event => {
                                                   this.setState({probability: parseFloat(event.target.value)})
                                               },
                                               type: "number",
                                               min: 0.01,
                                               max: 0.99,
                                               step: 0.01
                                           }}
                                           class="wide form-control form-control-sm"/>
                                <button className="btn btn-dark btn-sm"
                                        onClick={this.autoFillMatrixData}>
                                    Auto create matrix
                                </button>
                            </div>
                        </div>
                        <div className="m-card">
                            <button
                                onClick={this.markDomens}
                                className="btn btn-outline-info btn-block">
                                Get domains count
                            </button>
                        </div>
                        <div className="m-card">
                            <BootstrapTable headers={["Size of matrix", "Probability", "Domens"]}
                                            data={this.state.tableData}/>
                        </div>
                    </div>
                    <div className="col-7">
                        <Matrix model={this.state.matrix}
                                updateMatrix={(i, y) => this.setState(
                                    {matrix: updateMatrix(this.state.matrix, i, y)})}/>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Page/>,
    document.getElementById("container"));
