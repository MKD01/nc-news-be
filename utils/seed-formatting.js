exports.formatTopics = (topics) => {
  const formattedTopics = topics.map((topic) => [
    topic.slug,
    topic.description,
  ]);

  return formattedTopics;
};

exports.formatUsers = (users) => {
  const formattedUsers = users.map((user) => [
    user.username,
    user.avatar_url,
    user.name,
  ]);

  return formattedUsers;
};

exports.formatArticles = (articles) => {
  const formattedArticles = articles.map((article) => [
    article.title,
    article.body,
    article.votes,
    article.topic,
    article.author,
    article.created_at,
  ]);

  return formattedArticles;
};

exports.formatComments = (comments) => {
  const formattedComments = comments.map((comment) => [
    comment.author,
    comment.article_id,
    comment.votes,
    comment.created_at,
    comment.body,
  ]);

  return formattedComments;
};
