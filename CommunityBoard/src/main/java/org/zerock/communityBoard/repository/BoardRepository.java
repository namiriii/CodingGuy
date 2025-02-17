package org.zerock.communityBoard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.communityBoard.domain.Board;


public interface BoardRepository extends JpaRepository<Board, Long> {
	@Query(value = "select now()", nativeQuery=true)
	String getTime();
}
