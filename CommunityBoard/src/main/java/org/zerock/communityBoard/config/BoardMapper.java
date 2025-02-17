package org.zerock.communityBoard.config;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.zerock.communityBoard.DTO.BoardDTO;
import org.zerock.communityBoard.domain.Board;



@Mapper(componentModel = "spring")

public interface BoardMapper {
	
	// 엔터티 → DTO 변환
    @Mapping(target = "bno", source = "bno")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "writer", source = "writer")
    @Mapping(target = "likeCount", source = "likeCount")
    @Mapping(target = "regDate", source = "regDate")
    @Mapping(target = "modDate", source = "modDate")
    BoardDTO toDto(Board board);

    // DTO → 엔터티 변환
    @Mapping(target = "bno", source = "bno")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "writer", source = "writer")
    @Mapping(target = "likeCount", source = "likeCount")
    Board toEntity(BoardDTO boardDTO);
}
