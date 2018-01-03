import React from "react";
import ReactDOM from "react-dom";

class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.placeholder = props.placeholder || "Введите значение";
        this.class = props.class || "form-control";
        this.state = {value: props.value};
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue(e) {
        const callback = this.props.inputProps.onChange;
        if (callback != null) {
            callback(e);
        } else {
            let val = e.target.value;
            this.setState({value: val});
            this.props.callback(val);
        }
        e.preventDefault;
    }

    render() {
        return (
            <input
                className={this.class}
                placeholder={this.placeholder}
                value={this.state.value}
                min={this.props.inputProps.min}
                max={this.props.inputProps.max}
                step={this.props.inputProps.step}
                type={this.props.inputProps.type || "text"}
                onChange={this.changeValue}/>
        );
    }
}

class BootstrapTable extends React.Component {
    render() {
        const dataVector = this.props.data || [];
        const headerVector = this.props.headers || [];
        const headers = headerVector.map((v, i) => <th key={i}>{v}</th>);
        const rows = dataVector.map((r, y) => {
            const cells = r.map((cell, index) => <td key={index}>{cell}</td>);
            return <tr key={y}>{cells}</tr>
        });

        return (
            <table className="table table-sm table-hover">
                <thead>
                <tr>{headers}</tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

export {InputForm, BootstrapTable};
