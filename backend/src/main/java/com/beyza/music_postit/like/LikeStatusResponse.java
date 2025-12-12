package com.beyza.music_postit.like;

public class LikeStatusResponse {

    private Long noteId;
    private boolean liked;      // şu an beğenilmiş mi
    private long likesCount;    // toplam kaç kişi beğenmiş

    public LikeStatusResponse() {
    }

    public LikeStatusResponse(Long noteId, boolean liked, long likesCount) {
        this.noteId = noteId;
        this.liked = liked;
        this.likesCount = likesCount;
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public long getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(long likesCount) {
        this.likesCount = likesCount;
    }
}
