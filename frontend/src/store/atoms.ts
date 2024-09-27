// import { atom, selector } from 'recoil';

// type TokenType = string | null; // Define a type for the token

// const tokenAtom = atom<TokenType>({
//   key: 'authToken',
//   default: null, // Initially store no token
// });

// const usernameSelector = selector({
//   key: 'usernameSelector',
//   get: ({ get }) => {
//     const token = get(tokenAtom);
//     const decodedData = token ? jwtDecode(token) : {};
//     const username = decodedData?.sub;
//     return username;
//   },
// });

// export { tokenAtom, usernameSelector };