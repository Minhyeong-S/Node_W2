const { Router } = require("express");
const commentRouter = Router();
const authMiddleware = require("./auth-middleware");
const { User, Post, Comment } = require("../models");

// 특정 포스트에 작성된 댓글 목록 전체
commentRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ result: comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: error.message });
  }
});

// 특정 포스트에 댓글 작성. 로그인 필요 => authMiddleware 경유
commentRouter.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const isPostId = await Post.findByPk(postId);
    if (!isPostId)
      return res
        .status(400)
        .send({ errorMessage: "게시글이 존재하지 않습니다." });

    const { comment } = req.body;
    if (!comment)
      return res
        .status(400)
        .send({ errorMessage: "댓글 내용을 입력해주세요." });

    const { user } = res.locals;
    await Comment.create({
      userId: user.userId,
      postId,
      comment,
    });
    return res.send({ msg: "댓글이 작성되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: error.message });
  }
});

// 댓글 삭제. 로그인 필요 => authMiddleware 경유
commentRouter.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { user } = res.locals;
    const comment = await Comment.findByPk(commentId);
    if (!comment)
      return res
        .status(400)
        .send({ errorMessage: "존재하지 않는 댓글입니다." });
    if (comment.userId !== user.userId)
      return res
        .status(400)
        .send({ errorMessage: "작성자 본인만 삭제할 수 있습니다." });

    await Comment.destroy({ where: { commentId } });
    return res.status(200).send({ msg: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: error.message });
  }
});

// 게시글 수정. 로그인 필요 => authMiddleware 경유
commentRouter.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { user } = res.locals;
    const comment = await Comment.findByPk(commentId);
    if (!comment)
      return res
        .status(400)
        .send({ errorMessage: "존재하지 않는 댓글입니다." });
    if (comment.userId !== user.userId)
      return res
        .status(400)
        .send({ errorMessage: "작성자 본인만 수정할 수 있습니다." });

    await Comment.update({ comment }, { where: { commentId } });
    return res.status(200).send({ msg: "댓글이 수정되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: error.message });
  }
});

module.exports = { commentRouter };
