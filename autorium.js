"use strict";

const { Contract } = require("fabric-contract-api");

class TerrariumMonitor extends Contract {
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    const devices = [
      {
        deviceId: "device1",
        owner: "Client",
        sensorData: [
          { temperature: 22.5, humidity: 40, timestamp: Date.now() },
          { temperature: 23.1, humidity: 42, timestamp: Date.now() },
        ],
      },
      {
        deviceId: "device2",
        owner: "Business",
        sensorData: [
          { temperature: 24.2, humidity: 39, timestamp: Date.now() },
          { temperature: 24.8, humidity: 41, timestamp: Date.now() },
        ],
      },
      {
        deviceId: "device3",
        owner: "Manufacturer",
        sensorData: [
          { temperature: 25.4, humidity: 45, timestamp: Date.now() },
          { temperature: 25.9, humidity: 47, timestamp: Date.now() },
        ],
      },
    ];

    for (let i = 0; i < devices.length; i++) {
      devices[i].docType = "device";
      await ctx.stub.putState(
        "DEVICE" + i,
        Buffer.from(JSON.stringify(devices[i]))
      );
      console.info("Added <--> ", devices[i]);
    }
    console.info("============= END : Initialize Ledger ===========");
  }

  async queryDevice(ctx, deviceId) {
    const deviceAsBytes = await ctx.stub.getState(deviceId);
    if (!deviceAsBytes || deviceAsBytes.length === 0) {
      throw new Error(`${deviceId} does not exist`);
    }
    console.log(deviceAsBytes.toString());
    return deviceAsBytes.toString();
  }

  async createDevice(ctx, deviceId, owner) {
    console.info("============= START : Create Device ===========");

    const device = {
      docType: "device",
      deviceId,
      owner,
      sensorData: [],
    };

    await ctx.stub.putState(deviceId, Buffer.from(JSON.stringify(device)));
    console.info("============= END : Create Device ===========");
  }

  async recordSensorData(ctx, deviceId, data) {
    console.info("============= START : Record Sensor Data ===========");

    const deviceAsBytes = await ctx.stub.getState(deviceId);
    if (!deviceAsBytes || deviceAsBytes.length === 0) {
      throw new Error(`${deviceId} does not exist`);
    }
    const device = JSON.parse(deviceAsBytes.toString());
    device.sensorData.push(data);

    await ctx.stub.putState(deviceId, Buffer.from(JSON.stringify(device)));
    console.info("============= END : Record Sensor Data ===========");
  }
}

module.exports = TerrariumMonitor;
