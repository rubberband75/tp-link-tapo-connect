import { getColour } from "./colour-helper";
import { base64Decode } from "./tplink-cipher";
import { TapoDeviceInfo, TapoProtocol } from "./types";

export const TapoDevice = ({ send }: TapoProtocol) => {
  const setDeviceOn = async (deviceOn: boolean = true) => {
    const turnDeviceOnRequest = {
      method: "set_device_info",
      params: {
        device_on: deviceOn,
      },
    };
    return await send(turnDeviceOnRequest);
  };

  const augmentTapoDeviceInfo = (
    deviceInfo: TapoDeviceInfo
  ): TapoDeviceInfo => {
    return {
      ...deviceInfo,
      ssid: base64Decode(deviceInfo.ssid),
      nickname: base64Decode(deviceInfo.nickname),
    };
  };

  return {
    turnOn: () => setDeviceOn(true),

    turnOff: () => setDeviceOn(false),

    setDeviceInfo: async ({
      deviceOn,
      hue,
      saturation,
      brightness,
      temperature,
      colorTemp,
    }: {
      deviceOn?: boolean;
      hue?: number;
      saturation?: number;
      brightness?: number;
      temperature?: number;
      colorTemp?: number;
    } = {}) => {
      return await send({
        method: "set_device_info",
        params: {
          device_on: deviceOn,
          hue: hue,
          saturation: saturation,
          brightness: brightness,
          temperature: temperature,
          color_temp: colorTemp,
        },
      });
    },

    setBrightness: async (brightnessLevel: number = 100) => {
      const setBrightnessRequest = {
        method: "set_device_info",
        params: {
          brightness: brightnessLevel,
        },
      };
      return await send(setBrightnessRequest);
    },

    setColour: async (colour: string = "white") => {
      const params = getColour(colour);

      const setColourRequest = {
        method: "set_device_info",
        params,
      };
      return await send(setColourRequest);
    },

    getDeviceInfo: async (): Promise<TapoDeviceInfo> => {
      const statusRequest = {
        method: "get_device_info",
      };
      return augmentTapoDeviceInfo(await send(statusRequest));
    },

    getEnergyUsage: async (): Promise<TapoDeviceInfo> => {
      const statusRequest = {
        method: "get_energy_usage",
      };
      return await send(statusRequest);
    },
  };
};
