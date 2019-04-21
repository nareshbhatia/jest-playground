export class Chart {
    xvalues;
    yvalues;

    constructor(xvalues, yvalues) {
        this.xvalues = xvalues;
        this.yvalues = yvalues;
    }

    render() {
        return this.xvalues.map((xvalue, index) => ({
            x: xvalue,
            y: this.yvalues[index]
        }));
    }
}
