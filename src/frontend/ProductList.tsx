import { Avatar, CircularProgress, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import * as React from 'react';
import { FETCH_STATUS_FETCHING, useFetch } from 'src/frontend/useFetch';
import { IThing } from 'src/services/IThing';
import { host, searchOriginPath, searchPort } from 'src/services/serviceorigins';

interface IProductPropTypes {
  item: IThing;
}

interface IProductListPropTypes {
  search?: string;
}

const Product = ({item}: IProductPropTypes) => (
  <>
    <ListItem>
      <ListItemAvatar>
        <Avatar alt='' src={item.thumbnail}/>
      </ListItemAvatar>
      <ListItemText primary={item.name} secondary={`Rating: ${item.suggestedRating}`}/>
    </ListItem>
    <li>
      <Divider inset={true}/>
    </li>
  </>
);

export const ProductList = ({search}: IProductListPropTypes) => {
  let endpoint = `${host}:${searchPort}${searchOriginPath}search/${search}`;
  if(search === '') {
    endpoint = `${host}:${searchPort}${searchOriginPath}default`;
  }
  const [data, dataStatus] = useFetch(endpoint, {docs: [], explain: []});
  return (
    <List>
      {dataStatus === FETCH_STATUS_FETCHING && <CircularProgress/>}
      {data.docs.map((item: IThing) => <Product key={item.id} item={item}/>)}
    </List>
  );
};
