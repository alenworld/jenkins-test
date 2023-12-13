const ValidationConstants = {
  password: {
    lowerCaseAlphabetPattern: /^.*[a-z].*$/,
    upperCaseAlphabetPattern: /^.*[A-Z].*$/,
    numberPattern: /^.*[\d].*$/,
    resetEmailTimeout: 120,
  },
  filters: {
    datePeriod: '^([0-9]{1,2}\\/[0-9]{1,2}\\/[0-9]{4})?-([0-9]{1,2}\\/[0-9]{1,2}\\/[0-9]{4})?$', // from-to | -to | from-
  },
};

export default ValidationConstants;
