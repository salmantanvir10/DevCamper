

//middleware for sorting,selection and pagination

exports.customMiddleware = async (
  modelName,  
  findOptions,
  sortingMethod,
  Requestquery,
  pathToPopulate,
  next
) => {
  try {
    let getSelectedColumns = Requestquery.select;
    let getLimit = Requestquery.limit;
    let getPage = Requestquery.page;

    const query = modelName
      .find(findOptions)
      .populate(
        pathToPopulate.length == 0                 //checking here if path is provided for populating  
          ? console.log("Path Not Provided")
          : { path: pathToPopulate, options: { strictPopulate: false } }
      )
      .select(getSelectedColumns)
      .limit(getLimit)
      .skip((getPage - 1) * getLimit);

    if (sortingMethod) {
      query.sort(sortingMethod);
    }

    return query;
  } catch (err) {
    next(err);
  }
};
