const router = require('express').Router();
const cardsConroller = require('../controllers/cards');

router.get('/', cardsConroller.getCards);

router.post('/', cardsConroller.createCard);

router.delete('/:cardId', cardsConroller.deleteCard);

router.put('/:cardId/likes', cardsConroller.likeCard);

router.delete('/:cardId/likes', cardsConroller.dislikeCard);

module.exports = router;
