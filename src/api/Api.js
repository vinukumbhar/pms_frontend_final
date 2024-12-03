import axios from 'axios';

const API_CONTACTURL = 'http://127.0.0.1:7000/contacts/';

export const fetchContacts = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: API_CONTACTURL,
    headers: { }
  };

  const response = await axios.request(config);
  return response.data;
};

export const deleteContact = async (id) => {
  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${API_CONTACTURL}${id}`,
    headers: { }
  };

  await axios.request(config);
};
