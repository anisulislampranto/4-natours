exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    tour: 'The forest hiker',
    user: 'Jonas',
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest hiker tour ',
  });
};
