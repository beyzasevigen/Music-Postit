package com.beyza.music_postit.note;

public class NoteCreateRequest {

    private Long songId;
    private Integer timestampSec;
    private String text;
    private Boolean isPublic;

    public NoteCreateRequest() {
    }

    public Long getSongId() {
        return songId;
    }

    public void setSongId(Long songId) {
        this.songId = songId;
    }

    public Integer getTimestampSec() {
        return timestampSec;
    }

    public void setTimestampSec(Integer timestampSec) {
        this.timestampSec = timestampSec;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
}
