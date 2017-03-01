# jsongrid
Functions works with convertion csv-tab-like grids in json and OBRATNO


"\t \n" csv-like txt file

`data.txt`
```
categoryId	subjectId	subject	category	distribution	distributionType	flex	options
1	1	Domain name	Registration&renewal	1	client
2	1	Domain name	Various troubleshooting	3	client
3	2	Email	New email account	4	office
4	2	Email	Change/recover email password	8	office
```


```js
import { csv2grid, grid2objects } from 'jsongrid';
const data = grid2objects(
  csv2grid(
    require('raw!./data.txt'),
  ),
)

console.log(data[0].subject); // 'Domain name'
```


