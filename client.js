const PROTO_PATH = __dirname + '/routing.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


module.exports = async function main(address) {
    let packageDefinition = protoLoader.loadSync(
        PROTO_PATH,
        {keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
        let routing_proto = grpc.loadPackageDefinition(packageDefinition).routing;
    let client = new routing_proto.Routing('localhost:50051',
                                        grpc.credentials.createInsecure());

    const makeGrpcCallRoute = (options) => {
        return new Promise((resolve, reject) => {
            client.GetRouting(options, (error, response) => {
                    if (error) { reject(error); }
                    resolve(response);
                });
        });
    };

    const makeGrpcCallDest = (options) => {
        return new Promise((resolve, reject) => {
            client.GetDestinations(options, (error, response) => {
                    if (error) { reject(error); }
                    resolve(response);
                });
        });
    };

    
    
    const result = await makeGrpcCallRoute({address: JSON.parse(address)});
    const destination = await makeGrpcCallDest({address: JSON.parse(address)});
    return {result: result.result, destination: destination.destination};
}
