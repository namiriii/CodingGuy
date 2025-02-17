package org.zerock.communityBoard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.communityBoard.domain.UserEntity;


public interface UserRepository extends JpaRepository<UserEntity, Long>{
	Optional<UserEntity> findByUsername(String username);
}
