export interface Config {
  services: Services;
}

export interface Services {
  tf2Skin: string;
}

export default (): Config => {
  return {
    services: {
      tf2Skin: process.env.TF2_SKIN_SERVICE_URL,
    },
  };
};
