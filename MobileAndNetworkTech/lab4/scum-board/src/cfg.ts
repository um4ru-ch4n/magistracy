type ConfigType = {
	apiURI: string,
}

const config: ConfigType = {
	apiURI: `http://${process.env.REACT_APP_BACK_HOSTNAME || 'localhost:8000'}`,
};

export default config;