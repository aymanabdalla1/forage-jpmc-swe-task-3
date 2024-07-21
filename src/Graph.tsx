import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';
import { time } from 'console';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      price_abc: 'float', // The price of stock ABC.
      price_def: 'float', // The price of stock DEF.
      ratio: 'float', // The ratio of the price of stock ABC to stock DEF.
      timestamp: 'date', // The time when the data was received.
      upper_bound: 'float', // The upper bound of the ratio.
      lowerbound: 'float', // The lower bound of the ratio.
      trigger_alert: 'float', // The trigger alert of when bound is crossed.
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line'); // Set the default view to line chart.
      elem.setAttribute('row-pivots', '["timestamp"]'); // Set the default row pivot to timestamp.
      elem.setAttribute('columns', '["ratio", "lowerbound", "upper_bound", "trigger_alert"]'); // Set the default columns to display.
      elem.setAttribute('aggregates', JSON.stringify({ // Set the default aggregate values.
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        timestamp: 'distinct count',
        upper_bound: 'avg',
        lowerbound: 'avg',
        trigger_alert: 'avg'
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),] as unknown as TableData);
    }
  }
}

export default Graph;
