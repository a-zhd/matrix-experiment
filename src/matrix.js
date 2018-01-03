import React from "react";
import ReactDOM from "react-dom";

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.onPressHandler = this.onPressHandler.bind(this);
    }

    onPressHandler() {
        const [i, y] = this.props.index;
        this.props.updateMatrix(i, y);
    }

    render() {
        const [value, color] = this.props.value;
        const val = value ? 1 : 0;
        return (
            <span className="border border-dark matrixCell"
                  style={{backgroundColor: color}}
                  onClick={this.onPressHandler}>
              <span>{val}</span>
            </span>
        );
    }
}

export default class Matrix extends React.Component {
    render() {
        const model = this.props.model || [];
        const n = model.length;
        const m = n != 0 ? model[0].length : 0;
        const rows = model.map((row, i) => {
                const cells = row.map((val, y) =>
                    <Cell index={[i, y]}
                          value={val}
                          updateMatrix={this.props.updateMatrix}
                          key={[i, y, val]}/>
                );
                return <div className="inline-content" key={i}>{cells}</div>;
            }
        );

        return (
            <div className="m-card">
                {rows}
            </div>
        );
    }
}
