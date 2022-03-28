export default {
  methods: {
    useInstallationName(str = '', installationName) {
      return str.replace(/Bonsai/g, installationName);
    },
  },
};
