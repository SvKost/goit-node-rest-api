import jwt, { decode } from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader !== 'string') {
    return res.status(401).send({ message: 'Not authorized' });
  }

  const [bearer, token] = authorizationHeader.split(' ', 2);

  if (bearer !== 'Bearer') {
    return res.status(401).send({ message: 'Not authorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({ message: 'Not authorized' });
    }

    if (decode.id === null) {
      return res.status(401).send({ message: 'Not authorized' });
    }

    req.user = { id: decode.id, email: decode.email };

    next();
  });
};

export default auth;
