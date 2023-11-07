const Column = ({ t }) => {
  return [
    {
      name: 'otp',
      title: 'Mã Otp',
      formItem: {
        placeholder: 'Mã Otp',
        rules: [{ type: 'required' }],
      },
    },
  ];
};

export default Column;
