import React from 'react';
import axios from 'axios';

import {api} from '../shared/NodeApi';
import Error from '../shared/Error';
import ServiceFactory from '../services/ServiceFactory';

import NetworkInfo from './NetworkInfo';
import LastBlockList from './LastBlockList';
import UnconfirmedTxList from './UnconfirmedTxList';

const LAST_BLOCKS_COUNT = 20;

export default class MainPage extends React.Component {

    state = {
        info: {},
        unconfirmed: [],
        blocks: [],
        hasError: false
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        axios.all([
            api.version(),
            api.blocks.height(),
            api.baseTarget()
        ]).then(axios.spread((version, height, baseTarget) => {
            const info = {
                'Version': version.data.version,
                'Current height': height.data.height,
                'Base Target': baseTarget.data.baseTarget
            };
            this.setState({info});

            const to = height.data.height;
            const from = Math.max(1, to - LAST_BLOCKS_COUNT);
            api.blocks.headers.sequence(from, to)
                .then(blocksResponse => {
                    const blocks = blocksResponse.data.map(block => block).reverse();
                    this.setState({blocks});
                });

            return api.blocks.headers.last();
        })).then(headerResponse => {
            return api.blocks.delay(headerResponse.data.signature, headerResponse.data.height - 2)
                .then(delayResponse => {
                    const delay = (parseInt(delayResponse.data.delay) / 1000 / 60.0).toFixed(1);
                    const newInfo = Object.assign({}, this.state.info, {'Avg Block delay': `${delay} minutes`}) ;
                    this.setState({info: newInfo});
                });
        }).catch(error => {
            console.error(error);

            this.setState({hasError: true});
        });

        api.transactions.unconfirmed().then(response => {
            const transformer = ServiceFactory.transactionTransformerService();

            return transformer.transform(response.data);
        }).then(unconfirmed => {
            this.setState({unconfirmed});
        }).catch(error => {
            console.error(error);

            this.setState({hasError: true});
        });
    }

    render() {
        if (this.state.hasError) {
            return <Error title="Unable to load last blocks and transactions"/>;
        }

        return (
            <React.Fragment>
                <div className="info-box">
                    <NetworkInfo info={this.state.info} />
                </div>
                <div className="grid grid-wrap">
                    <div className="column-6 column-sm-12">
                        <LastBlockList blocks={this.state.blocks} />
                    </div>
                    <div className="column-6 column-sm-12">
                        <UnconfirmedTxList transactions={this.state.unconfirmed} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
