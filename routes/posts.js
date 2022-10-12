const { Router } = require("express");
const postRouter = Router();
const authMiddleware = require("./auth-middleware");
const { User, Post, Likes } = require("../models");

// 전체 게시글 목록
postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: { exclude: ["content"] },
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.send({ posts });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ errorMessage: err.message });
  }
});

// 특정 게시글 상세조회
postRouter.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  if (postId === "like") return next();
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
    });

    return res.send({ post });
  } catch (error) {
    console.error(err);
    return res.status(500).send({ errorMessage: err.message });
  }
});

// 게시글 작성. 로그인 필요 => authMiddleware 경유
postRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title)
      return res.status(400).send({ errorMessage: "title is required" });
    if (!content)
      return res.status(400).send({ errorMessage: "content is required" });

    const { user } = res.locals;
    await Post.create({ userId: user.userId, title, content });
    return res.status(200).send({ msg: "게시글이 작성되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
});

// 게시글 삭제. 로그인 필요 => authMiddleware 경유
postRouter.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;
    const post = await Post.findByPk(postId);
    if (!post)
      return res
        .status(400)
        .send({ errorMessage: "존재하지 않는 게시글입니다." });
    if (post.userId !== user.userId)
      return res
        .status(400)
        .send({ errorMessage: "작성자 본인만 삭제할 수 있습니다." });

    await Post.destroy({ where: { postId } });
    return res.status(200).send({ msg: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
});

// 게시글 수정. 로그인 필요 => authMiddleware 경유
postRouter.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { user } = res.locals;
    const { title, content } = req.body;
    if (!title)
      return res.status(400).send({ errorMessage: "title is required" });
    if (!content)
      return res.status(400).send({ errorMessage: "content is required" });

    const post = await Post.findByPk(postId);
    if (!post)
      return res
        .status(400)
        .send({ errorMessage: "존재하지 않는 게시글입니다." });
    if (post.userId !== user.userId)
      return res
        .status(400)
        .send({ errorMessage: "작성자 본인만 수정할 수 있습니다." });

    await Post.update({ title, content }, { where: { postId } });
    return res.status(200).send({ msg: "게시글이 수정되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
});

// 게시글 좋아요! 등록/취소. 로그인 필요 => authMiddleware 경유
postRouter.post("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(postId);
    const post = await Post.findByPk(postId);
    if (!post)
      return res
        .status(400)
        .send({ errorMessage: "존재하지 않는 게시글입니다." });
    const { user } = res.locals;

    const isLike = await Likes.findOne({
      where: { postId, userId: user.userId },
    });

    if (!isLike) {
      await Likes.create({ postId, userId: user.userId });
      await Post.increment({ likesCount: 1 }, { where: { postId } });
      return res.status(201).send({ msg: "좋아요 하셨습니다." });
    } else {
      await Likes.destroy({ where: { postId, userId: user.userId } });
      await Post.decrement({ likesCount: 1 }, { where: { postId } });
      return res.status(200).send({ msg: "좋아요를 취소하였습니다." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
});

// 좋아요 게시글 조회. 로그인 필요 => authMiddleware 경유
postRouter.get("/like", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    console.log(user.userId);
    const allPost = await Post.findAll({
      include: ["Likes"],
      order: [["likesCount", "DESC"]],
    });
    const likesPost = await allPost.filter(
      (v) => v.Likes.filter((v2) => v2.userId === user.userId).length > 0
    );
    // .sort((a, b) => {
    //   return b.likesCount - a.likesCount;
    // });

    return res.status(200).send(likesPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
});

module.exports = { postRouter };
