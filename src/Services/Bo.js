import { Http } from '@Services';
export const Bo = {
    /**
     * @returns
     * userId,
     * volume,
     * orderNum,
     * winNum,
     * depositTotal,
     * winnerTotal
     */
    getTopTrading: async () => {
        return await Http.Request('GET', '/top/');

        // return [
        //     {
        //         userId: 'AGJD2121212mmndlajdal;dasd',
        //         volume: 10291,
        //         orderNum: 10,
        //         winNum: 2,
        //         depositTotal: 100,
        //         winnerTotal: 31,
        //     },
        //     {
        //         userId: 'AGJD2121212mmndlajda1245',
        //         volume: 23561,
        //         orderNum: 43,
        //         winNum: 12,
        //         depositTotal: 1234,
        //         winnerTotal: 31,
        //     },
        //     {
        //         userId: 'AGJD2121212mmndlajdadfgdfg5',
        //         volume: 32524,
        //         orderNum: 43,
        //         winNum: 12,
        //         depositTotal: 1234,
        //         winnerTotal: 31,
        //     },
        //     {
        //         userId: 'AGJD2121212mmndlaj679867867',
        //         volume: 5464,
        //         orderNum: 43,
        //         winNum: 12,
        //         depositTotal: 1234,
        //         winnerTotal: 31,
        //     },
        //     {
        //         userId: 'AGJD2121212mmndlaj67986',
        //         volume: 1231,
        //         orderNum: 43,
        //         winNum: 12,
        //         depositTotal: 1234,
        //         winnerTotal: 31,
        //     },
        // ];
    },

    /**
     * 
     * exchange: ['binance', 'coinbasepro']
     *  symbol:  e.x "BNBUSDT"
     * mode: ['singleprice', 'multiprice']
     * currency: new Map([[0, 'ETH'], [1, 'USDT'], [2, 'WBTC'], [3, 'eFIBO'], [4, 'BNB'], [5, 'BUSD'], [6, 'BTCB'], [7, 'bFIBO'], [8, 'MATIC'], [9, 'USDC'], [10, 'mBTC'], [11, 'mFIBO']], [12, 'dUSD']),
         //currency truyen 0-11
     * 
     * @returns 
     * 
     * bull
     * bear
     * 
     */
    getLiveBullBear: async params => {
        return await Http.Request('GET', '/live', params);
        // return { bull: Math.random() * 1000, bear: Math.random() * 1000 };
    },

    /**
     * params: {
        userId 
        quantity
        currency: [[0, 'ETH'], [1, 'USDT'], [2, 'WBTC'], [3, 'eFIBO'], [4, 'BNB'], [5, 'BUSD'], [6, 'BTCB'], [7, 'bFIBO'], [8, 'MATIC'], [9, 'USDC'], [10, 'mBTC'], [11, 'mFIBO'], [12, 'dUSD']]
        side: true(bull), false(bear)
        network: ['ethereum', 'smartchain', 'polygon']
        symbol : e.x "BTCUSDT"
        exchange: "binance"
        mode: "multiprice"
        userId
        }
     * @returns 
        
     */
    bet: async params => {
        return await Http.Request('POST', '/bet', null, params);
        // return { message: 'success' };
    },

    /**
     * params: {
        network: ['ethereum', 'smartchain', 'polygon']
        currency: [[0, 'ETH'], [1, 'USDT'], [2, 'WBTC'], [3, 'eFIBO'], [4, 'BNB'], [5, 'BUSD'], [6, 'BTCB'], [7, 'bFIBO'], [8, 'MATIC'], [9, 'USDC'], [10, 'mBTC'], [11, 'mFIBO'], [12, 'dUSD']]
        receiver
        value
        }
     * @returns 
        
     */

    withdraw: async params => {
        return await Http.Request('POST', '/withdraw', null, params);
        // return { message: 'success' };
    },

    /**
     * params: {
        userId
        }
     * @returns 
     * userId
     * parent
     * volume
     * orderNum
     * winNum
     * depositTotal
     * winnerTotal
     * member : [0,0,0,0,0] (F1-F5)
     * sales : [0,0,0,0,0](F1-F5)
     * copySub : ["0x..", ...]
     * copyFee : 
     * copyFrom : ["0x..", ...]
     * score :
     * balance : [0,0..,0] [[0, 'ETH'], [1, 'USDT'], [2, 'WBTC'], [3, 'eFIBO'], [4, 'BNB'], [5, 'BUSD'], [6, 'BTCB'], [7, 'bFIBO'], [8, 'MATIC'], [9, 'USDC'], [10, 'mBTC'], [11, 'mFIBO'], [12, 'dUSD']]
     * history : user history
        * {
            event: ['withdraw', 'order', 'deposit', 'winner', 'tier', 'referral', 'dev', 'pool', 'copyfee'] one of events
            value: value of event
            currency: type crypto [[0, 'ETH'], [1, 'USDT'], [2, 'WBTC'], [3, 'eFIBO'], [4, 'BNB'], [5, 'BUSD'], [6, 'BTCB'], [7, 'bFIBO'], [8, 'MATIC'], [9, 'USDC'], [10, 'mBTC'], [11, 'mFIBO'], [12, 'dUSD']]
            timestamp : event occur timestamp
        }
    */

    getUserInfo: async params => {
        return await Http.Request('GET', '/user', params);
        // return {
        //     userId: '0x4d4b46b0Cf9aDAB155304938E0d4Ab54173a6429',
        //     parent: '0x4d4b46b0Cf9aDAB155304938E0d4Ab54173a6429',
        //     volume: 2000,
        //     orderNum: 21,
        //     winNum: 12,
        //     depositTotal: 3000,
        //     winnerTotal: 1231,
        //     member: [123, 324, 345, 456, 6575],
        //     sales: [41, 232, 123, 234, 1234],
        //     copySub: ['0x4d4b46b0Cf9aDAB155304938E0d4Ab54173a6429'],
        //     copyFee: 1231,
        //     copyFrom: ['0x4d4b46b0Cf9aDAB155304938E0d4Ab54173a6429'],
        //     score: 12312,
        //     balance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10000],
        //     history: [
        //         {
        //             event: 'referral',
        //             value: 123,
        //             currency: 0,
        //             timestamp: 123,
        //         },
        //         {
        //             event: 'withdraw',
        //             value: 123,
        //             currency: 1,
        //             timestamp: 123,
        //         },
        //         {
        //             event: 'deposit',
        //             value: 123,
        //             currency: 2,
        //             timestamp: 123,
        //         },
        //         {
        //             event: 'winner',
        //             value: 123,
        //             currency: 3,
        //             timestamp: 123,
        //         },
        //         {
        //             event: 'copyfee',
        //             value: 123,
        //             currency: 3,
        //             timestamp: 123,
        //         },
        //     ],
        // };
    },

    /**
     * params: {
        userId: user address,
        parent: parent address
        }
     * @returns 
    */
    create: async params => {
        return await Http.Request('POST', '/create', null, params);
        // return 'success';
    },
    /**
     * params: {
        userId: user address
        }
     * @returns 
    */
    restore: async params => {
        return await Http.Request('POST', '/restore', null, params);
        // return 'success';
    },
    /**
     * params: {
        userId: user address
        }
     * @returns 
     *  array
     *  {
            "userId": "0xBf84171B179383c8315Dc5F4f0420342b4005528",
            "orderIndex": 97,
            "mode": "multiprice",
            "copyFrom": "0xBf84171B179383c8315Dc5F4f0420342b4005528",
            "symbol": "BNBUSDT",
            "exchange": "binance",
            "currency": 12,
            "network": "demo",
            "price": 341.5,
            "quantity": 1093.35,
            "side": "bull",
            "session": 2152,
            "timestamp": 1627794070350,
            "result": "tie",
            "profitRate": 0,
            "_id": "97"
        }
     */
    history: async params => {
        return await Http.Request('GET', '/history', params);
    },
};
