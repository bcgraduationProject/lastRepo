'use strict';

const { Contract } = require('fabric-contract-api');

class BloodChainContract extends Contract {
    async initLedger(ctx) {
        console.log('Initializing the ledger with some blood samples.');

        const bloodSamples = [
            {
                id: "1",
                bloodType: "A+",
                donor: "John Doe",
                status: "Available",
            },
            {
                id: "2",
                bloodType: "O-",
                donor: "Jane Smith",
                status: "Available",
            },
            // Add more blood samples here...
        ];

        for (let i = 0; i < bloodSamples.length; i++) {
            await ctx.stub.putState(`${i+1}`, Buffer.from(JSON.stringify(bloodSamples[i])));
            console.log(`Blood sample ${i} initialized.`);
        }

        console.log('Ledger initialized successfully.');
    }

    async getBloodSample(ctx, sampleId) {
        const sampleJSON = await ctx.stub.getState(sampleId);

        if (!sampleJSON || sampleJSON.length === 0) {
            throw new Error(`Blood sample ${sampleId} does not exist.`);
        }

        return sampleJSON.toString();
    }

    async createBloodSample(ctx, sampleId, bloodType, donor) {
        const bloodSample = {
            id: sampleId,
            bloodType,
            donor,
            status: 'Available',
        };

        await ctx.stub.putState(sampleId, Buffer.from(JSON.stringify(bloodSample)));
        console.log(`Blood sample ${sampleId} created successfully.`);
    }

    async updateBloodSampleStatus(ctx, sampleId, newStatus) {
        const bloodSampleJSON = await ctx.stub.getState(sampleId);

        if (!bloodSampleJSON || bloodSampleJSON.length === 0) {
            throw new Error(`Blood sample ${sampleId} does not exist.`);
        }

        const bloodSample = JSON.parse(bloodSampleJSON.toString());
        bloodSample.status = newStatus;

        await ctx.stub.putState(sampleId, Buffer.from(JSON.stringify(bloodSample)));
        console.log(`Blood sample ${sampleId} status updated to ${newStatus} successfully.`);
    }
    
       // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async getAssetHistory(ctx, assetId) {
        const resultsIterator = await ctx.stub.getHistoryForKey(assetId);
      
        const allResults = [];
        let res = await resultsIterator.next();
      
        while (!res.done) {
          if (res.value && res.value.value.toString()) {
            const strValue = Buffer.from(res.value.value.toString()).toString('utf8');
            let record;
            try {
              record = JSON.parse(strValue);
            } catch (err) {
              console.log(err);
              record = strValue;
            }
            allResults.push(record);
          }
          res = await resultsIterator.next();
        }
      
        await resultsIterator.close();
      
        return JSON.stringify(allResults);
      }
      

}


module.exports = BloodChainContract;
